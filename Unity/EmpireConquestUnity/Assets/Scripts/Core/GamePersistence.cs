using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using EmpireConquest.Core;
using UnityEngine;

namespace EmpireConquest.UnityRuntime
{
    public static class GamePersistence
    {
        private static readonly string SavePath = Path.Combine(Application.persistentDataPath, "empire_state.dat");

        public static void Save(GameState state)
        {
            try
            {
#pragma warning disable SYSLIB0011
                var formatter = new BinaryFormatter();
                using var stream = File.Create(SavePath);
                formatter.Serialize(stream, state);
#pragma warning restore SYSLIB0011
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"Save failed: {ex.Message}");
            }
        }

        public static bool TryLoad(out GameState state)
        {
            state = new GameState();
            if (!File.Exists(SavePath))
            {
                return false;
            }

            try
            {
#pragma warning disable SYSLIB0011
                var formatter = new BinaryFormatter();
                using var stream = File.OpenRead(SavePath);
                var obj = formatter.Deserialize(stream);
#pragma warning restore SYSLIB0011
                if (obj is GameState loaded)
                {
                    state = loaded;
                    return true;
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"Load failed: {ex.Message}");
            }

            return false;
        }
    }
}
