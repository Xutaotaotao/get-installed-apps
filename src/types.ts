// -------------------------
// Metadata interfaces
// -------------------------

export interface MacMdlsMetadata {
    _kMDItemDisplayNameWithExtensions?: string;
    kMDItemAppStoreCategory?: string;
    kMDItemAppStoreCategoryType?: string;
    kMDItemCFBundleIdentifier?: string;
    kMDItemContentCreationDate?: string;
    kMDItemContentCreationDate_Ranking?: string;
    kMDItemContentModificationDate?: string;
    kMDItemContentType?: string;
    kMDItemCopyright?: string;
    kMDItemDateAdded?: string;
    kMDItemDisplayName?: string;
    kMDItemDocumentIdentifier?: string;
    kMDItemFSContentChangeDate?: string;
    kMDItemFSCreationDate?: string;
    kMDItemFSFinderFlags?: string;
    kMDItemFSInvisible?: string;
    kMDItemFSIsExtensionHidden?: string;
    kMDItemFSLabel?: string;
    kMDItemFSName?: string;
    kMDItemFSNodeCount?: string;
    kMDItemFSOwnerGroupID?: string;
    kMDItemFSOwnerUserID?: string;
    kMDItemFSSize?: string;
    kMDItemInterestingDate_Ranking?: string;
    kMDItemKind?: string;
    kMDItemLastUsedDate?: string;
    kMDItemLastUsedDate_Ranking?: string;
    kMDItemLogicalSize?: string;
    kMDItemPhysicalSize?: string;
    kMDItemUseCount?: string;
    kMDItemVersion?: string;
    // Convenience aliases mirrored from the kMDItem* attributes above
    appName?: string;
    appVersion?: string;
    appIdentifier?: string;
    appInstallDate?: string;
}

export interface MacPlutilMetadata {
    CFBundleDisplayName?: string;
    CFBundleExecutable?: string;
    CFBundleIconFile?: string;
    CFBundleIdentifier?: string;
    CFBundleInfoDictionaryVersion?: string;
    CFBundleName?: string;
    CFBundlePackageType?: string;
    CFBundleShortVersionString?: string;
    CFBundleVersion?: string;
    LSBackgroundOnly?: string;
    NSAppleEventsUsageDescription?: string;
    NSPrincipalClass?: string;
}

export type LinuxPackageMetadata = {
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

export type Win32RegistryMetadata = {
    'Inno Setup: Setup Version'?: string;
    'Inno Setup: App Path'?: string;
    InstallLocation?: string;
    'Inno Setup: Icon Group'?: string
    'Inno Setup: User'?: string
    'Inno Setup: Selected Tasks'?: string
    'Inno Setup: Deselected Tasks'?: string
    'Inno Setup: Language'?: string
    DisplayName?: string;
    DisplayIcon?: string;
    UninstallString?: string;
    QuietUninstallString?: string;
    DisplayVersion?: string;
    Publisher?: string;
    appPublisher?: string;
    URLInfoAbout?: string;
    HelpLink?: string;
    URLUpdateInfo?: string;
    NoModify?: string;
    NoRepair?: string;
    InstallDate?: string;
    appInstallDate?: string;
    MajorVersion?: string;
    MinorVersion?: string;
    VersionMajor?: string;
    VersionMinor?: string;
    EstimatedSize?: string;
};

// -------------------------
// Base return type
// -------------------------

export interface BaseReturnData {
  appName: string | null;
  appIdentifier: string | null;
  appVersion: string | null;
  installPath?: string | null;
}

// -------------------------
// Conditional type helpers
// -------------------------

export type Platform = "darwin" | "win32" | "linux";

// Allowed methods per platform
export type MethodForPlatform<P extends Platform> =
  P extends "darwin"
    ? "mdls" | "plutil"
    : P extends "win32"
      ? "registry"
      : P extends "linux"
        ? "dpkg" | "snap" | "flatpak"
        : never;

// Metadata type based on platform + method
export type MetadataFor<
  P extends Platform,
  M extends MethodForPlatform<P>
> =
  P extends "darwin"
    ? M extends "mdls"
      ? MacMdlsMetadata
      : M extends "plutil"
        ? MacPlutilMetadata
        : never
    : P extends "win32"
      ? Win32RegistryMetadata
      : P extends "linux"
        ? LinuxPackageMetadata
        : never;

// -------------------------
// ReturnData type
// -------------------------

export type ReturnData<
  P extends Platform,
  M extends MethodForPlatform<P>
> = BaseReturnData & {
  platform: P;
  method: M;
  metadata: MetadataFor<P, M>;
};
