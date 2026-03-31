using System;
using System.IO;
using UnityEditor;
using UnityEditor.Build.Reporting;

namespace EmpireConquest.EditorTools
{
    public static class BuildPipelineScript
    {
        private const string ScenePath = "Assets/Scenes/EmpireMain.unity";

        public static void BuildAndroidRelease()
        {
            EnsureScene();
            if (!EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Android, BuildTarget.Android))
            {
                throw new Exception("Failed to switch build target to Android.");
            }

            var projectRoot = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, ".."));
            var buildDir = Path.Combine(projectRoot, "Build");
            Directory.CreateDirectory(buildDir);

            var keystorePath = Environment.GetEnvironmentVariable("EC_ANDROID_KEYSTORE");
            var keystorePass = Environment.GetEnvironmentVariable("EC_ANDROID_KEYSTORE_PASS");
            var keyaliasName = Environment.GetEnvironmentVariable("EC_ANDROID_KEYALIAS");
            var keyaliasPass = Environment.GetEnvironmentVariable("EC_ANDROID_KEYALIAS_PASS");

            if (string.IsNullOrWhiteSpace(keystorePath))
            {
                keystorePath = Path.Combine(buildDir, "empire-release.jks");
            }

            if (!string.IsNullOrWhiteSpace(keystorePass) &&
                !string.IsNullOrWhiteSpace(keyaliasName) &&
                !string.IsNullOrWhiteSpace(keyaliasPass))
            {
                PlayerSettings.Android.useCustomKeystore = true;
                PlayerSettings.Android.keystoreName = keystorePath;
                PlayerSettings.Android.keystorePass = keystorePass;
                PlayerSettings.Android.keyaliasName = keyaliasName;
                PlayerSettings.Android.keyaliasPass = keyaliasPass;
            }

            EditorUserBuildSettings.buildAppBundle = false;
            var apkPath = Path.Combine(buildDir, "EmpireConquest-v0.3.apk");
            var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = new[] { ScenePath },
                target = BuildTarget.Android,
                locationPathName = apkPath,
                options = BuildOptions.None
            });

            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new Exception("Android build failed: " + report.summary.result + " errors=" + report.summary.totalErrors + " warnings=" + report.summary.totalWarnings);
            }
        }

        public static void BuildWindowsExe()
        {
            EnsureScene();
            if (!EditorUserBuildSettings.SwitchActiveBuildTarget(BuildTargetGroup.Standalone, BuildTarget.StandaloneWindows64))
            {
                throw new Exception("Failed to switch build target to Windows64.");
            }

            var projectRoot = Path.GetFullPath(Path.Combine(Environment.CurrentDirectory, ".."));
            var buildDir = Path.Combine(projectRoot, "Build", "Windows");
            Directory.CreateDirectory(buildDir);

            var exePath = Path.Combine(buildDir, "EmpireConquest.exe");
            var report = BuildPipeline.BuildPlayer(new BuildPlayerOptions
            {
                scenes = new[] { ScenePath },
                target = BuildTarget.StandaloneWindows64,
                locationPathName = exePath,
                options = BuildOptions.None
            });

            if (report.summary.result != BuildResult.Succeeded)
            {
                throw new Exception("Windows build failed: " + report.summary.result);
            }
        }

        private static void EnsureScene()
        {
            if (!File.Exists(ScenePath))
            {
                CreatePhase2Scenes.CreateAll();
            }
        }
    }
}
