using EmpireConquest.Gameplay;
using EmpireConquest.Runtime;
using EmpireConquest.Scenes;
using EmpireConquest.UI;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace EmpireConquest.EditorTools
{
    public static class CreatePhase2Scenes
    {
        [MenuItem("Empire Conquest/Create Phase2 Scenes")]
        public static void CreateAll()
        {
            System.IO.Directory.CreateDirectory("Assets/Scenes");
            CreateMainScene();
            CreateTrollMapScene();
            CreateClanWarScene();

            EditorBuildSettings.scenes = new[]
            {
                new EditorBuildSettingsScene("Assets/Scenes/EmpireMain.unity", true),
                new EditorBuildSettingsScene("Assets/Scenes/TrollMap.unity", true),
                new EditorBuildSettingsScene("Assets/Scenes/ClanWar.unity", true),
            };
            AssetDatabase.Refresh();
            EditorUtility.DisplayDialog("Empire Conquest", "Phase-2 scenes created and added to build settings.", "OK");
        }

        private static void CreateMainScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var runtime = new GameObject("EmpireGameRuntime").AddComponent<EmpireGameRuntime>();
            new GameObject("EmpireBuildingSandbox").AddComponent<EmpireBuildingSandbox>();
            new GameObject("BattleDirector").AddComponent<BattleDirector>();
            var ui = new GameObject("EmpireUiBootstrap").AddComponent<EmpireUiBootstrap>();
            var so = new SerializedObject(ui);
            so.FindProperty("runtime").objectReferenceValue = runtime;
            so.ApplyModifiedPropertiesWithoutUndo();
            EditorSceneManager.SaveScene(scene, "Assets/Scenes/EmpireMain.unity");
        }

        private static void CreateTrollMapScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var runtime = new GameObject("EmpireGameRuntime").AddComponent<EmpireGameRuntime>();
            var map = new GameObject("TrollMapController").AddComponent<TrollMapSceneController>();
            var so = new SerializedObject(map);
            so.FindProperty("runtime").objectReferenceValue = runtime;
            so.ApplyModifiedPropertiesWithoutUndo();
            EditorSceneManager.SaveScene(scene, "Assets/Scenes/TrollMap.unity");
        }

        private static void CreateClanWarScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);
            var runtime = new GameObject("EmpireGameRuntime").AddComponent<EmpireGameRuntime>();
            var clan = new GameObject("ClanWarController").AddComponent<ClanWarSceneController>();
            var so = new SerializedObject(clan);
            so.FindProperty("runtime").objectReferenceValue = runtime;
            so.ApplyModifiedPropertiesWithoutUndo();
            EditorSceneManager.SaveScene(scene, "Assets/Scenes/ClanWar.unity");
        }
    }
}
