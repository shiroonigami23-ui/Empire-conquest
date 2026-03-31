using EmpireConquest.Runtime;
using UnityEngine;

namespace EmpireConquest.Scenes
{
    public class TrollMapSceneController : MonoBehaviour
    {
        [SerializeField] private EmpireGameRuntime runtime = null!;

        private void Start()
        {
            if (runtime == null)
            {
                runtime = FindFirstObjectByType<EmpireGameRuntime>();
            }

            CreateNode(new Vector3(-6f, 0.6f, 0f), new Color(0.55f, 0.8f, 0.3f), "troll_camp_alpha");
            CreateNode(new Vector3(2f, 0.6f, 4f), new Color(0.9f, 0.45f, 0.2f), "troll_fort_beta");
        }

        private void CreateNode(Vector3 pos, Color color, string baseId)
        {
            var node = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            node.name = baseId;
            node.transform.position = pos;
            node.transform.localScale = new Vector3(1.4f, 1.4f, 1.4f);
            var r = node.GetComponent<Renderer>();
            if (r != null)
            {
                r.material = new Material(Shader.Find("Standard"));
                r.material.color = color;
            }
            node.AddComponent<MapNodeClick>().Init(runtime, baseId);
        }

        private class MapNodeClick : MonoBehaviour
        {
            private EmpireGameRuntime _runtime = null!;
            private string _id = "";

            public void Init(EmpireGameRuntime runtime, string id)
            {
                _runtime = runtime;
                _id = id;
            }

            private void OnMouseDown()
            {
                if (_runtime == null)
                {
                    return;
                }
                Debug.Log(_runtime.ScoutEnemyBase(_id));
            }
        }
    }
}
