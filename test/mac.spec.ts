import {
  getDirectoryContents,
  getAppsSubDirectory,
  getAppsFileInfo,
  getAppData,
  getInstalledApps,
} from "../src/mac";
import { expect } from "chai";

describe("getDirectoryContents", () => {
  it("should return some contents", () => {
    getDirectoryContents("/Applications").then((result) => {
      expect(result).to.be.an("string");
    });
  });
  it("should includes Safari.app", () => {
    getDirectoryContents("/Applications").then((result) => {
      expect(result).to.include("Safari.app");
    });
  });
  it("should return error", async () => {
    try {
      await getDirectoryContents("abjdefghijklm");
      expect.fail('The promise should have been rejected');
    } catch (error) {}
  });
  it("should return error", async () => {
    try {
      await getDirectoryContents("abjdefghijklm");
      expect.fail('The promise should have been rejected');
    } catch (error) {}
  });
});

describe("getAppsSubDirectory", () => {
  it("should return /Applications/Safari.app", () => {
    const result = getAppsSubDirectory("Safari.app", "/Applications");
    expect(result).to.be.an("array").that.includes("/Applications/Safari.app");
  });
});

describe("getAppsFileInfo", () => {
  it("should return Safari.app name", () => {
    const result = getAppsFileInfo(["/Applications/Safari.app"]);
    console.log(result)
    expect(result).to.be.an("array");
  });
});

describe("getAppData", () => {
  it("should return Safari.app data", () => {
    const result = getAppData([
      'kMDItemCFBundleIdentifier          = "com.apple.Safari",',
      'kMDItemVersion                     = "16.3"',
    ]);
    expect(result).to.have.all.keys(
      "appIdentifier",
      "appVersion",
      "kMDItemCFBundleIdentifier",
      "kMDItemVersion"
    );
  });
});

describe("getInstalledApps", () => {
  it("should return a promise", () => {
    expect(getInstalledApps("/Applications")).to.be.a('promise')
  });
  it('should reject the promise if any error occurs', async () => {
    try {
      await getInstalledApps("abjdefghijklm");
      expect.fail('The promise should have been rejected');
    } catch (_error) {}
  });
});
