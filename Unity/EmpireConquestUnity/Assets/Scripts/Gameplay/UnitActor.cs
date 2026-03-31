using UnityEngine;
using System.Collections;

namespace EmpireConquest.Gameplay
{
    public class UnitActor : MonoBehaviour
    {
        public int Team;
        public float Hp = 100f;
        public float Attack = 12f;
        public float MoveSpeed = 4f;
        public float AttackRange = 1.6f;
        public float AttackCooldown = 0.8f;

        private float _cooldown;
        private UnitActor _target = null!;
        private Renderer _renderer = null!;

        private void Awake()
        {
            _renderer = GetComponent<Renderer>();
        }

        public void SetTarget(UnitActor target)
        {
            _target = target;
        }

        public bool IsAlive => Hp > 0f;

        public void Tick(float deltaTime)
        {
            if (!IsAlive || _target == null || !_target.IsAlive)
            {
                return;
            }

            var targetPos = _target.transform.position;
            var dist = Vector3.Distance(transform.position, targetPos);

            if (dist > AttackRange)
            {
                transform.position = Vector3.MoveTowards(transform.position, targetPos, MoveSpeed * deltaTime);
                return;
            }

            _cooldown -= deltaTime;
            if (_cooldown > 0f)
            {
                return;
            }

            _cooldown = AttackCooldown;
            _target.ReceiveDamage(Attack);
            StartCoroutine(Flash(Color.red, 0.07f));
        }

        public void ReceiveDamage(float amount)
        {
            Hp -= amount;
            if (Hp <= 0f)
            {
                Hp = 0f;
                gameObject.SetActive(false);
            }
        }

        public void SetTeamColor(Color color)
        {
            if (_renderer == null)
            {
                return;
            }
            _renderer.material = new Material(Shader.Find("Standard"));
            _renderer.material.color = color;
        }

        private IEnumerator Flash(Color color, float duration)
        {
            if (_renderer == null)
            {
                yield break;
            }
            var baseColor = _renderer.material.color;
            _renderer.material.color = color;
            yield return new WaitForSeconds(duration);
            if (_renderer != null && gameObject.activeSelf)
            {
                _renderer.material.color = baseColor;
            }
        }
    }
}
