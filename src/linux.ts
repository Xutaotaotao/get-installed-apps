import { execSync } from "child_process";

export type LinuxInstalledApp = {
  name: string;
  packageId: string;
  version: string | null;
  type: "dpkg" | "snap" | "flatpak";

  repository?: string | null;
  architecture?: string | null;
  maintainer?: string | null;
  license?: string | null;
  section?: string | null;
  description?: string | null;
  installed_size?: number | null;
  install_date?: string | null;

  is_system_package?: number;
  is_auto_installed?: number;
};

export async function getInstalledApps(): Promise<LinuxInstalledApp[]> {
  const apps: LinuxInstalledApp[] = [];
  const seen = new Set<string>();

  /* -------------------- DPKG / APT -------------------- */
  try {
    const output = execSync(
      `dpkg-query -W -f='${"${Package}"}|${"${Version}"}|${"${Architecture}"}|${"${Maintainer}"}|${"${Section}"}|${"${Installed-Size}"}|${"${binary:Summary}"}|${"${db:Status-Abbrev}"}\n'`,
      { encoding: "utf8" }
    );
    
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
    
      apps.push({
        name: pkg,
        packageId: pkg,
        version: version || null,
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
      });
    }    
  } catch {}

  /* -------------------- SNAP -------------------- */
  try {
    const snapList = execSync("snap list", { encoding: "utf8" });
    const snapInfoCache = new Map<string, string>();

    for (const line of snapList.split("\n").slice(1)) {
      const parts = line.trim().split(/\s+/);
      if (!parts[0] || seen.has(parts[0])) continue;

      const name = parts[0];
      seen.add(name);

      let description: string | null = null;
      let license: string | null = null;

      try {
        const info = execSync(`snap info ${name}`, { encoding: "utf8" });
        snapInfoCache.set(name, info);

        const descMatch = info.match(/description:\s+([\s\S]*?)\n\S/);
        description = descMatch?.[1]?.trim() ?? null;

        const licenseMatch = info.match(/license:\s+(.+)/);
        license = licenseMatch?.[1] ?? null;
      } catch {}

      apps.push({
        name,
        packageId: name,
        version: parts[1] || null,
        type: "snap",
        repository: "snapcraft",
        architecture: parts[6] || null,
        maintainer: null,
        license,
        section: "snap",
        description,
        installed_size: null,
        install_date: null,
        is_system_package: 0,
        is_auto_installed: 0,
      });
    }
  } catch {}

  /* -------------------- FLATPAK -------------------- */
  try {
    const flatpakList = execSync(
      "flatpak list --app --columns=application,version,origin,arch",
      { encoding: "utf8" }
    );

    for (const line of flatpakList.split("\n")) {
      if (!line.trim()) continue;

      const [id, version, origin, arch] = line.split("\t");
      if (!id || seen.has(id)) continue;
      seen.add(id);

      apps.push({
        name: id.split(".").pop() ?? id,
        packageId: id,
        version: version || null,
        type: "flatpak",
        repository: origin || null,
        architecture: arch || null,
        maintainer: null,
        license: null,
        section: "flatpak",
        description: null,
        installed_size: null,
        install_date: null,
        is_system_package: 0,
        is_auto_installed: 0,
      });
    }
  } catch {}

  return apps;
}
