import { exec } from "child_process";
import { promisify } from "util";
import { LinuxPackageMetadata, ReturnData } from "./types";

const execAsync = promisify(exec);


export async function getInstalledApps(): Promise<ReturnData<"linux", "dpkg" | "snap" | "flatpak">[]> {
  const apps: ReturnData<"linux", "dpkg" | "snap" | "flatpak">[] = [];
  const seen = new Set<string>();

  async function processDpkg() {
  try {
    const output = (await execAsync(
      `dpkg-query -W -f='${"${Package}"}|${"${Version}"}|${"${Architecture}"}|${"${Maintainer}"}|${"${Section}"}|${"${Installed-Size}"}|${"${binary:Summary}"}|${"${db:Status-Abbrev}"}\n'`,
      { encoding: "utf8" }
    )).stdout;

    const packages: Array<{
      pkg: string;
      version: string;
      arch: string;
      maintainer: string;
      section: string;
      size: string;
      summary: string;
      status: string;
    }> = [];

    for (const line of output.split("\n")) {
      if (!line.trim()) continue;

      const parts = line.split("|");
      if (parts.length < 8) continue;

      const [
        pkg,
        version,
        arch,
        maintainer,
        section,
        size,
        summary,
        status,
      ] = parts;

      if (!pkg || seen.has(pkg)) continue;
      seen.add(pkg);

      packages.push({ pkg, version, arch, maintainer, section, size, summary, status });
    }

    const installPaths = await Promise.all(packages.map(async ({ pkg }) => {
      try {
        // Get all files installed by the package
        const filesResult = await execAsync(`dpkg-query -L "${pkg}"`, { encoding: "utf8" });
        const files = filesResult.stdout.trim().split('\n').filter(f => f.trim());

        // Priority 1: Look for installation directory in /opt
        const optFile = files.find(f => f.startsWith('/opt/'));
        if (optFile) {
          const match = optFile.match(/^(\/opt\/[^/]+)/);
          if (match) return match[1];
        }

        // Priority 2: Look for executables in common bin directories
        const binPaths = ['/usr/bin/', '/usr/local/bin/', '/bin/', '/sbin/', '/usr/sbin/'];
        for (const file of files) {
          for (const binPath of binPaths) {
            if (file.startsWith(binPath)) {
              const filename = file.substring(binPath.length);
              // Only match direct files, not subdirectories
              if (!filename.includes('/')) {
                return file;
              }
            }
          }
        }

        // Priority 3: Try to find a .desktop file and extract the Exec path
        const desktopFile = files.find(f => f.endsWith('.desktop'));
        if (desktopFile) {
          try {
            const desktopContent = await execAsync(`grep -m 1 '^Exec=' "${desktopFile}"`, { encoding: "utf8" });
            const execLine = desktopContent.stdout.trim();
            if (execLine) {
              // Extract the command path, removing arguments and field codes like %U, %F
              let execPath = execLine.replace(/^Exec=/, '').split(/\s+/)[0];
              // Remove any remaining field codes
              execPath = execPath.replace(/%[a-zA-Z]/g, '').trim();
              if (execPath) return execPath;
            }
          } catch {}
        }

        // Priority 4: Look for any executable matching the package name in /usr/share or similar
        const shareDir = files.find(f => f.includes(`/usr/share/${pkg}/`) || f.includes(`/usr/lib/${pkg}/`));
        if (shareDir) {
          const match = shareDir.match(new RegExp(`^(/usr/(?:share|lib)/${pkg})`));
          if (match) return match[1];
        }

        return "";
      } catch {
        return "";
      }
    }));

    packages.forEach(({ pkg, version, arch, maintainer, section, size, summary, status }, index) => {
      const installPath = installPaths[index];

      const metadata: LinuxPackageMetadata = {
        type: "dpkg",
        architecture: arch || null,
        maintainer: maintainer || null,
        section: section || null,
        description: summary || null,
        installed_size: size ? Number(size) * 1024 : null,
        repository: null,
        license: null,
        install_date: null,
        is_system_package: section?.startsWith("libs") || section?.startsWith("admin") ? 1 : 0,
        is_auto_installed: status?.includes("iA") ? 1 : 0,
      };

      const appReturn: ReturnData<"linux", "dpkg"> = {
        appName: pkg,
        appIdentifier: pkg,
        platform: "linux",
        appVersion: version || null,
        method: "dpkg",
        metadata: metadata,
        installPath: installPath || "",
      };

      apps.push(appReturn);
    });
  } catch {}
  }

  async function processSnap() {
  try {
    const snapListOutput = (await execAsync("snap list", { encoding: "utf8" })).stdout;

    const snaps: Array<{
      name: string;
      version: string;
      arch: string;
      repository: string;
    }> = [];

    for (const line of snapListOutput.split("\n").slice(1)) {
      const parts = line.trim().split(/\s+/);
      if (!parts[0] || seen.has(parts[0])) continue;

      const name = parts[0];
      seen.add(name);

      snaps.push({
        name,
        version: parts[1] || "",
        arch: parts[2] || "",
        repository: parts[3] || "",
      });
    }

    const snapInfos = await Promise.all(snaps.map(async ({ name }) => {
      try {
        const info = (await execAsync(`snap info "${name}"`, { encoding: "utf8" })).stdout;
        const descMatch = info.match(/description:\s+([\s\S]*?)\n\S/);
        const description = descMatch?.[1]?.trim() ?? null;
        const licenseMatch = info.match(/license:\s+(.+)/);
        const license = licenseMatch?.[1] ?? null;
        return { description, license };
      } catch {
        return { description: null, license: null };
      }
    }));

    const installPaths = await Promise.all(snaps.map(async ({ name }) => {
      try {
        const result = await execAsync(`find /snap/bin -name "${name}" -type l`, { encoding: "utf8" });
        return result.stdout.trim();
      } catch {
        return "";
      }
    }));

    snaps.forEach(({ name, version, arch, repository }, index) => {
      const { description, license } = snapInfos[index];
      const installPath = installPaths[index];

      const metadata: LinuxPackageMetadata = {
        type: "snap",
        repository: repository || null,
        architecture: arch || null,
        license: license,
        section: "snap",
        description: description,
      };
      const appReturn: ReturnData<"linux", "snap"> = {
        appName: name,
        appIdentifier: name,
        platform: "linux",
        appVersion: version || null,
        metadata: metadata,
        method: "snap",
        installPath: installPath || "",
      };

      apps.push(appReturn);
    });
  } catch {}
  }

  async function processFlatpak() {
  try {
    const flatpakListOutput = (await execAsync(
      "flatpak list --app --columns=application,version,origin,arch",
      { encoding: "utf8" }
    )).stdout;

    const flatpaks: Array<{
      id: string;
      version: string;
      origin: string;
      arch: string;
    }> = [];

    for (const line of flatpakListOutput.split("\n")) {
      if (!line.trim()) continue;

      const [id, version, origin, arch] = line.split("\t");
      if (!id || seen.has(id)) continue;
      seen.add(id);

      flatpaks.push({ id, version: version || "", origin: origin || "", arch: arch || "" });
    }

    const installPaths = await Promise.all(flatpaks.map(async ({ id }) => {
      try {
        const result = await execAsync(`flatpak info --show-location "${id}"`, {
          encoding: "utf8",
        });
        return result.stdout.trim();
      } catch {
        return "";
      }
    }));

    flatpaks.forEach(({ id, version, origin, arch }, index) => {
      const installPath = installPaths[index];

      const metadata: LinuxPackageMetadata = {
        type: "flatpak",
        repository: origin || null,
        architecture: arch || null,
        section: "flatpak",
      };
      const appReturn: ReturnData<"linux", "flatpak"> = {
        appName: id.split(".").pop() || null,
        appIdentifier: id,
        platform: "linux",
        appVersion: version || null,
        method: "flatpak",
        metadata,
        installPath: installPath || null,
      };

      apps.push(appReturn);
    });
  } catch {}
  }

  await Promise.all([processDpkg(), processSnap(), processFlatpak()]);

  return apps;
}
