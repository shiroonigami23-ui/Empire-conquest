using UnityEngine;

namespace EmpireConquest.Gameplay
{
    public class BaseNpcRoamer : MonoBehaviour
    {
        [SerializeField] private float roamRadius = 8f;
        [SerializeField] private float speed = 2f;
        [SerializeField] private Transform petTarget = null!;

        private Vector3 _home;
        private Vector3 _goal;
        private float _timer;

        private void Start()
        {
            _home = transform.position;
            PickGoal();
        }

        private void Update()
        {
            _timer -= Time.deltaTime;
            if (_timer <= 0f || Vector3.Distance(transform.position, _goal) < 0.4f)
            {
                PickGoal();
            }

            transform.position = Vector3.MoveTowards(transform.position, _goal, speed * Time.deltaTime);
            if (petTarget != null)
            {
                var dir = transform.position - petTarget.position;
                if (dir.sqrMagnitude > 0.05f)
                {
                    petTarget.position += dir.normalized * (speed * 0.82f * Time.deltaTime);
                }
            }
        }

        private void PickGoal()
        {
            _timer = Random.Range(3f, 7f);
            var offset = new Vector3(Random.Range(-roamRadius, roamRadius), 0f, Random.Range(-roamRadius, roamRadius));
            _goal = _home + offset;
        }
    }
}
