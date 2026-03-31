using EmpireConquest.Gameplay;
using EmpireConquest.Runtime;
using EmpireConquest.UnityRuntime;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace EmpireConquest.EditorTools
{
    public static class CreateEmpireBootstrapScene
    {
        [MenuItem("Empire Conquest/Create Bootstrap Scene")]
        public static void CreateScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.DefaultGameObjects, NewSceneMode.Single);

            var ground = GameObject.CreatePrimitive(PrimitiveType.Plane);
            ground.name = "Ground";
            ground.transform.position = Vector3.zero;
            ground.transform.localScale = new Vector3(4f, 1f, 4f);
            var groundRenderer = ground.GetComponent<Renderer>();
            if (groundRenderer != null)
            {
                groundRenderer.sharedMaterial = new Material(Shader.Find("Standard"));
                groundRenderer.sharedMaterial.color = new Color(0.12f, 0.35f, 0.12f);
            }

            var runtimeGo = new GameObject("EmpireGameRuntime");
            var runtime = runtimeGo.AddComponent<EmpireGameRuntime>();

            var hudGo = new GameObject("EmpireDebugHud");
            var hud = hudGo.AddComponent<EmpireDebugHud>();
            var serializedHud = new SerializedObject(hud);
            serializedHud.FindProperty("runtime").objectReferenceValue = runtime;
            serializedHud.ApplyModifiedPropertiesWithoutUndo();

            var baseGo = new GameObject("EmpireBuildingSandbox");
            var baseSandbox = baseGo.AddComponent<EmpireBuildingSandbox>();

            var battleGo = new GameObject("BattleDirector");
            battleGo.transform.position = Vector3.zero;
            var battle = battleGo.AddComponent<BattleDirector>();

            var npc = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            npc.name = "BaseNpc";
            npc.transform.position = new Vector3(-6f, 0.9f, -6f);
            var npcRenderer = npc.GetComponent<Renderer>();
            if (npcRenderer != null)
            {
                npcRenderer.sharedMaterial = new Material(Shader.Find("Standard"));
                npcRenderer.sharedMaterial.color = new Color(0.9f, 0.85f, 0.7f);
            }

            var pet = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            pet.name = "NpcPetBear";
            pet.transform.position = new Vector3(-7.2f, 0.55f, -6f);
            pet.transform.localScale = new Vector3(0.8f, 0.8f, 1f);
            var petRenderer = pet.GetComponent<Renderer>();
            if (petRenderer != null)
            {
                petRenderer.sharedMaterial = new Material(Shader.Find("Standard"));
                petRenderer.sharedMaterial.color = new Color(0.4f, 0.27f, 0.18f);
            }

            var roamer = npc.AddComponent<BaseNpcRoamer>();
            var roamerSo = new SerializedObject(roamer);
            roamerSo.FindProperty("petTarget").objectReferenceValue = pet.transform;
            roamerSo.ApplyModifiedPropertiesWithoutUndo();

            var musicGo = new GameObject("MusicDirector");
            var musicSource = musicGo.AddComponent<AudioSource>();
            musicSource.loop = true;
            var music = musicGo.AddComponent<MusicDirector>();
            var musicSo = new SerializedObject(music);
            musicSo.FindProperty("battleDirector").objectReferenceValue = battle;
            musicSo.ApplyModifiedPropertiesWithoutUndo();

            var controlHudGo = new GameObject("EmpireSandboxHud");
            var controlHud = controlHudGo.AddComponent<EmpireSandboxHud>();
            var controlHudSo = new SerializedObject(controlHud);
            controlHudSo.FindProperty("runtime").objectReferenceValue = runtime;
            controlHudSo.FindProperty("buildingSandbox").objectReferenceValue = baseSandbox;
            controlHudSo.FindProperty("battleDirector").objectReferenceValue = battle;
            controlHudSo.ApplyModifiedPropertiesWithoutUndo();

            var camera = Camera.main;
            if (camera != null)
            {
                camera.transform.position = new Vector3(0f, 28f, -24f);
                camera.transform.rotation = Quaternion.Euler(42f, 0f, 0f);
                camera.backgroundColor = new Color(0.05f, 0.07f, 0.12f);
                camera.clearFlags = CameraClearFlags.SolidColor;
            }

            const string scenePath = "Assets/Scenes/EmpireBootstrap.unity";
            System.IO.Directory.CreateDirectory("Assets/Scenes");
            EditorSceneManager.SaveScene(scene, scenePath);
            AssetDatabase.Refresh();

            EditorUtility.DisplayDialog("Empire Conquest", $"Bootstrap scene created at:\n{scenePath}", "OK");
        }
    }
}
