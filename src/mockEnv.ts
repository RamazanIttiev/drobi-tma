import {
  isTMA,
  LaunchParams,
  mockTelegramEnv,
  parseInitData,
  retrieveLaunchParams,
} from "@telegram-apps/sdk-react";

// It is important, to mock the environment only for development purposes.
// When building the application the import.meta.env.DEV will value become
// `false` and the code inside will be tree-shaken (removed), so you will not
// see it in your final bundle.
if (import.meta.env.DEV) {
  await (async () => {
    if (await isTMA()) {
      return;
    }

    // Determine which launch params should be applied. We could already
    // apply them previously, or they may be specified on purpose using the
    // default launch parameters transmission method.
    let lp: LaunchParams | undefined;
    try {
      lp = retrieveLaunchParams();
    } catch (e) {
      const initDataRaw = new URLSearchParams([
        [
          "user",
          JSON.stringify({
            id: 99281932,
            first_name: "Andrew",
            last_name: "Rogue",
            username: "rogue",
            language_code: "en",
            is_premium: true,
            allows_write_to_pm: true,
          }),
        ],
        [
          "hash",
          "89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31",
        ],
        ["auth_date", "1716922846"],
        ["start_param", "debug"],
        ["chat_type", "sender"],
        ["chat_instance", "8428209589180549439"],
      ]).toString();

      lp = {
        themeParams: {
          accentTextColor: "#8774e1",
          bgColor: "#212121",
          buttonColor: "#8774e1",
          buttonTextColor: "#ffffff",
          destructiveTextColor: "#ff595a",
          headerBgColor: "#212121",
          hintColor: "#aaaaaa",
          linkColor: "#8774e1",
          secondaryBgColor: "#181818",
          sectionBgColor: "#212121",
          sectionHeaderTextColor: "#8774e1",
          subtitleTextColor: "#aaaaaa",
          textColor: "#f5f5f5",
        },
        initData: parseInitData(initDataRaw),
        initDataRaw,
        version: "8",
        platform: "tdesktop",
      };
    }

    mockTelegramEnv(lp);
    console.warn(
      "⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.",
    );
  })();
}
