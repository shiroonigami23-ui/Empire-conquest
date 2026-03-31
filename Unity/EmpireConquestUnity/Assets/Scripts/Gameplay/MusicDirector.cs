using UnityEngine;

namespace EmpireConquest.Gameplay
{
    [RequireComponent(typeof(AudioSource))]
    public class MusicDirector : MonoBehaviour
    {
        [SerializeField] private BattleDirector battleDirector = null!;
        [SerializeField] private AudioClip calmLoop = null!;
        [SerializeField] private AudioClip battleLoop = null!;

        private AudioSource _source = null!;
        private bool _isBattleTrack;

        private void Awake()
        {
            _source = GetComponent<AudioSource>();
            _source.loop = true;
            _source.playOnAwake = true;
            _source.spatialBlend = 0f;
        }

        private void Start()
        {
            if (calmLoop == null)
            {
                calmLoop = Resources.Load<AudioClip>("Audio/Music/calm_loop");
            }
            if (battleLoop == null)
            {
                battleLoop = Resources.Load<AudioClip>("Audio/Music/battle_loop");
            }
            PlayCalm();
        }

        private void Update()
        {
            if (battleDirector == null)
            {
                return;
            }

            if (battleDirector.BattleRunning && !_isBattleTrack)
            {
                PlayBattle();
            }
            else if (!battleDirector.BattleRunning && _isBattleTrack)
            {
                PlayCalm();
            }
        }

        private void PlayCalm()
        {
            _isBattleTrack = false;
            if (calmLoop != null)
            {
                _source.clip = calmLoop;
                _source.volume = 0.55f;
                _source.Play();
            }
        }

        private void PlayBattle()
        {
            _isBattleTrack = true;
            if (battleLoop != null)
            {
                _source.clip = battleLoop;
                _source.volume = 0.75f;
                _source.Play();
            }
        }
    }
}
