import { DrinkPreset } from "@/types";

export const DRINK_PRESETS: DrinkPreset[] = [
  { id: "beer_350", name: "ビール（350ml缶）", icon: "🍺", image: "/drinks/beer.svg", defaultVolumeMl: 350, alcoholPercentage: 5, pureAlcoholG: 14.0 },
  { id: "beer_500", name: "ビール（500ml缶）", icon: "🍺", image: "/drinks/beer.svg", defaultVolumeMl: 500, alcoholPercentage: 5, pureAlcoholG: 20.0 },
  { id: "sake", name: "日本酒（1合）", icon: "🍶", image: "/drinks/sake.svg", defaultVolumeMl: 180, alcoholPercentage: 15, pureAlcoholG: 21.6 },
  { id: "wine_glass", name: "ワイン（グラス）", icon: "🍷", image: "/drinks/wine.svg", defaultVolumeMl: 125, alcoholPercentage: 12, pureAlcoholG: 12.0 },
  { id: "highball", name: "ハイボール", icon: "🥃", image: "/drinks/highball.svg", defaultVolumeMl: 350, alcoholPercentage: 7, pureAlcoholG: 19.6 },
  { id: "chuhai", name: "チューハイ（350ml）", icon: "🍹", image: "/drinks/chuhai.svg", defaultVolumeMl: 350, alcoholPercentage: 5, pureAlcoholG: 14.0 },
  { id: "chuhai_strong", name: "ストロング系（350ml）", icon: "💪", image: "/drinks/strong.svg", defaultVolumeMl: 350, alcoholPercentage: 9, pureAlcoholG: 25.2 },
  { id: "shochu_rock", name: "焼酎（ロック1合）", icon: "🫗", image: "/drinks/shochu.svg", defaultVolumeMl: 180, alcoholPercentage: 25, pureAlcoholG: 36.0 },
  { id: "shochu_mizuwari", name: "焼酎（水割り）", icon: "🫗", image: "/drinks/shochu.svg", defaultVolumeMl: 60, alcoholPercentage: 25, pureAlcoholG: 12.0 },
  { id: "whiskey_single", name: "ウイスキー（シングル）", icon: "🥃", image: "/drinks/whiskey.svg", defaultVolumeMl: 30, alcoholPercentage: 40, pureAlcoholG: 9.6 },
  { id: "whiskey_double", name: "ウイスキー（ダブル）", icon: "🥃", image: "/drinks/whiskey.svg", defaultVolumeMl: 60, alcoholPercentage: 40, pureAlcoholG: 19.2 },
  { id: "umeshu", name: "梅酒（ロック）", icon: "🍑", image: "/drinks/umeshu.svg", defaultVolumeMl: 90, alcoholPercentage: 13, pureAlcoholG: 9.4 },
];
