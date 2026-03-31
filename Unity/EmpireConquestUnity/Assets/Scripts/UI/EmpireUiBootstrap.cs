using System;
using EmpireConquest.Runtime;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace EmpireConquest.UI
{
    public class EmpireUiBootstrap : MonoBehaviour
    {
        [SerializeField] private EmpireGameRuntime runtime = null!;

        private Text _status = null!;
        private InputField _searchInput = null!;

        private void Start()
        {
            if (runtime == null)
            {
                runtime = FindFirstObjectByType<EmpireGameRuntime>();
            }

            BuildUi();
        }

        private void BuildUi()
        {
            if (FindFirstObjectByType<EventSystem>() == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<EventSystem>();
                es.AddComponent<StandaloneInputModule>();
            }

            var canvasGo = new GameObject("MainCanvas");
            var canvas = canvasGo.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvasGo.AddComponent<CanvasScaler>().uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            canvasGo.AddComponent<GraphicRaycaster>();

            var panel = CreatePanel(canvasGo.transform, new Vector2(370, 0), new Vector2(360, 680), "Empire Controls");
            var y = -52f;

            CreateButton(panel, "Build Lab", new Vector2(0, y), () => Set(runtime.Build("laboratory", UnityEngine.Random.Range(4, 180)), "Laboratory"));
            y -= 42;
            CreateButton(panel, "Upgrade TH", new Vector2(0, y), () => Set(runtime.UpgradeTownHall(), "Town Hall Upgrade"));
            y -= 42;
            CreateButton(panel, "Expand Land", new Vector2(0, y), () => Set(runtime.ExpandLand(), "Land Expand"));
            y -= 42;
            CreateButton(panel, "Train Swordsmen", new Vector2(0, y), () => Set(runtime.Train("swordsman", 6), "Train Swordsmen"));
            y -= 42;
            CreateButton(panel, "Set Defenders", new Vector2(0, y), () => Set(runtime.SetDefensiveTroops("swordsman", 3), "Set Defenders"));
            y -= 42;
            CreateButton(panel, "Defend Attack", new Vector2(0, y), () => Set(runtime.DefendHomeBase(1200), "Defend Base"));
            y -= 42;
            CreateButton(panel, "Open Chest", new Vector2(0, y), () => Set(runtime.OpenChest("ui_chest_" + UnityEngine.Random.Range(1, 9999)), "Open Chest"));
            y -= 42;
            CreateButton(panel, "Start Clan War", new Vector2(0, y), () => { runtime.StartClanWar(); Msg("Clan war started."); });
            y -= 42;
            CreateButton(panel, "Clan War Battle", new Vector2(0, y), () => Set(runtime.ClanWarBattle(1600), "Clan War Battle"));
            y -= 50;

            CreateButton(panel, "Buy VIP Silver", new Vector2(0, y), () => Set(runtime.BuyVipPackage("vip_silver"), "VIP Silver"));
            y -= 42;
            CreateButton(panel, "Buy VIP Shop Item", new Vector2(0, y), () => Set(runtime.BuyVipShopItem("vip_elixir_crate"), "VIP Shop"));
            y -= 50;

            _searchInput = CreateInput(panel, "Search player id/name", new Vector2(0, y));
            y -= 42;
            CreateButton(panel, "Search + Raid Offline", new Vector2(0, y), RaidSearchedPlayer);
            y -= 56;

            _status = CreateText(panel, "Status: ready", new Vector2(0, y), 15, TextAnchor.UpperLeft, new Vector2(320, 150));
        }

        private void RaidSearchedPlayer()
        {
            var q = _searchInput != null ? _searchInput.text : "";
            var results = runtime.SearchPlayers(q);
            if (results.Count == 0)
            {
                Msg("No player found.");
                return;
            }

            foreach (var p in results)
            {
                if (!p.IsOnline)
                {
                    runtime.AttackPlayerBase(p.Id, out var status);
                    Msg($"{p.Name}: {status}");
                    return;
                }
            }

            Msg("Found players are online. Retry later.");
        }

        private void Set(bool ok, string action) => Msg(ok ? $"{action}: success" : $"{action}: failed");
        private void Msg(string m) { if (_status != null) _status.text = "Status: " + m; }

        private static RectTransform CreatePanel(Transform parent, Vector2 anchored, Vector2 size, string title)
        {
            var panelGo = new GameObject("Panel");
            panelGo.transform.SetParent(parent, false);
            var img = panelGo.AddComponent<Image>();
            img.color = new Color(0.08f, 0.1f, 0.16f, 0.88f);

            var rt = panelGo.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(1, 0.5f);
            rt.anchorMax = new Vector2(1, 0.5f);
            rt.pivot = new Vector2(1, 0.5f);
            rt.anchoredPosition = anchored;
            rt.sizeDelta = size;

            var titleText = CreateText(panelGo.transform, title, new Vector2(0, -18), 18, TextAnchor.MiddleCenter, new Vector2(size.x - 24, 28));
            titleText.fontStyle = FontStyle.Bold;
            return rt;
        }

        private static Button CreateButton(Transform parent, string label, Vector2 pos, Action onClick)
        {
            var go = new GameObject("Btn_" + label.Replace(" ", "_"));
            go.transform.SetParent(parent, false);
            var img = go.AddComponent<Image>();
            img.color = new Color(0.2f, 0.45f, 0.85f, 0.95f);
            var btn = go.AddComponent<Button>();
            btn.onClick.AddListener(() => onClick());

            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(320, 34);

            var txt = CreateText(go.transform, label, Vector2.zero, 14, TextAnchor.MiddleCenter, rt.sizeDelta);
            txt.color = Color.white;
            return btn;
        }

        private static InputField CreateInput(Transform parent, string placeholder, Vector2 pos)
        {
            var go = new GameObject("Input");
            go.transform.SetParent(parent, false);
            var img = go.AddComponent<Image>();
            img.color = new Color(0.16f, 0.17f, 0.21f, 0.95f);

            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = new Vector2(320, 34);

            var textGo = new GameObject("Text");
            textGo.transform.SetParent(go.transform, false);
            var text = textGo.AddComponent<Text>();
            text.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
            text.fontSize = 14;
            text.color = Color.white;
            text.alignment = TextAnchor.MiddleLeft;
            var textRt = textGo.GetComponent<RectTransform>();
            textRt.anchorMin = Vector2.zero;
            textRt.anchorMax = Vector2.one;
            textRt.offsetMin = new Vector2(10, 0);
            textRt.offsetMax = new Vector2(-10, 0);

            var phGo = new GameObject("Placeholder");
            phGo.transform.SetParent(go.transform, false);
            var ph = phGo.AddComponent<Text>();
            ph.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
            ph.fontSize = 14;
            ph.color = new Color(0.7f, 0.7f, 0.8f, 0.8f);
            ph.alignment = TextAnchor.MiddleLeft;
            ph.text = placeholder;
            var phRt = phGo.GetComponent<RectTransform>();
            phRt.anchorMin = Vector2.zero;
            phRt.anchorMax = Vector2.one;
            phRt.offsetMin = new Vector2(10, 0);
            phRt.offsetMax = new Vector2(-10, 0);

            var input = go.AddComponent<InputField>();
            input.textComponent = text;
            input.placeholder = ph;
            return input;
        }

        private static Text CreateText(Transform parent, string value, Vector2 pos, int size, TextAnchor anchor, Vector2 area)
        {
            var go = new GameObject("Text");
            go.transform.SetParent(parent, false);
            var txt = go.AddComponent<Text>();
            txt.font = Resources.GetBuiltinResource<Font>("Arial.ttf");
            txt.fontSize = size;
            txt.alignment = anchor;
            txt.text = value;
            txt.color = new Color(0.92f, 0.95f, 1f);

            var rt = go.GetComponent<RectTransform>();
            rt.anchorMin = new Vector2(0.5f, 1f);
            rt.anchorMax = new Vector2(0.5f, 1f);
            rt.pivot = new Vector2(0.5f, 1f);
            rt.anchoredPosition = pos;
            rt.sizeDelta = area;
            return txt;
        }
    }
}
