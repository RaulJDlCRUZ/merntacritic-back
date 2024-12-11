class ConsoleNames {
  constructor(identifier, longName, possibleNames) {
    this.identifier = identifier;
    this.longName = longName;
    this.possibleNames = possibleNames;
  }
}

/* NINTENDO */

const Nintendo3DS = new ConsoleNames("3DS", "Nintendo 3DS", [
  "3DS",
  "3DS XL",
  "2DS",
  "2DS XL",
  "N3DS",
  "N3DS XL",
  "N2DS",
  "N2DS XL",
  "Nintendo 3DS",
  "Nintendo 3DS XL",
  "Nintendo 2DS",
  "Nintendo 2DS XL",
  "New 3DS",
  "New 3DS XL",
  "New 2DS XL",
  "New Nintendo 3DS",
  "New Nintendo 3DS XL",
  "New Nintendo 2DS XL",
]);

const NintendoDS = new ConsoleNames("DS", "Nintendo DS", [
  "DS",
  "DS Lite",
  "NDS",
  "NDS Lite",
  "Nintendo DS",
  "Nintendo DS Lite",
]);

const NintendoDSi = new ConsoleNames("DSi", "Nintendo DSi", [
  "DSi",
  "DSi XL",
  "NDSi",
  "NDSi XL",
  "Nintendo DSi",
  "Nintendo DSi XL",
]);

const NintendoSwitch = new ConsoleNames("NSW", "Nintendo Switch", [
  "Nintendo Switch",
  "Switch",
  "NS",
  "NSW",
  "NintendoSwitch",
  "Nintendo NSW",
]);

const Wii = new ConsoleNames("Wii", "Nintendo Wii", [
  "Wii",
  "Wii Mini",
  "Wii Family Edition",
  "Nintendo Wii",
  "Nintendo Wii Mini",
  "Nintendo Wii Family Edition",
]);

const WiiU = new ConsoleNames("WiiU", "Nintendo Wii U", [
  "Wii U",
  "WiiU",
  "Nintendo Wii U",
  "Nintendo WiiU",
]);

const NES = new ConsoleNames("NES", "Nintendo Entertainment System", [
  "NES",
  "Famicom",
  "Family Computer",
  "Nintendo Entertainment System",
  "Nintendo Famicom",
  "Nintendo Family Computer",
]);

const SNES = new ConsoleNames("SNES", "Super Nintendo", [
  "SNES",
  "Super Nintendo",
  "Super Nintendo Entertainment System",
  "Super Famicom",
  "Super Family Computer",
  "Super NES",
  "Super NES Entertainment System",
  "Super NES Famicom",
  "Super NES Family Computer",
]);

const N64 = new ConsoleNames("N64", "Nintendo 64", [
  "N64",
  "Nintendo 64",
  "Nintendo64",
]);

const GameBoy = new ConsoleNames("GB", "Game Boy", [
  "GB",
  "Game Boy",
  "GameBoy",
  "Nintendo GB",
  "Nintendo Game Boy",
  "Nintendo GameBoy",
]);

const GameBoyColor = new ConsoleNames("GBC", "Game Boy Color", [
  "GBC",
  "Game Boy Color",
  "GameBoy Color",
  "Nintendo GBC",
]);

const GameBoyAdvance = new ConsoleNames("GBA", "Game Boy Advance", [
  "GBA",
  "Game Boy Advance",
  "GameBoy Advance",
  "Nintendo GBA",
  "GameBoyAdvance",
]);

const GameCube = new ConsoleNames("GCN", "Nintendo GameCube", [
  "GC",
  "GCN",
  "GameCube",
  "Nintendo GameCube",
  "GameCube Nintendo",
  "Nintendo GC",
]);

/* SONY */

const PSP = new ConsoleNames("PSP", "PlayStation Portable", [
  "PSP",
  "Sony PSP",
  "PlayStation Portable",
  "PS Portable",
  "PlayStation Portable 1000",
  "PlayStation Portable 2000",
  "PlayStation Portable 3000",
  "PlayStation Portable Go",
  "PlayStation Portable E1000",
  "PSP Go",
  "PSP E1000",
  "PSP 1000",
  "PSP 2000",
  "PSP 3000",
]);

const PSVita = new ConsoleNames("PSV", "PlayStation Vita", [
  "PlayStation Vita",
  "PS Vita",
  "PSVita",
  "PSV",
  "PlayStationVita",
  "PlayStation Vita 1000",
  "PlayStation Vita 2000",
  "PSVita 1000",
  "PSVita 2000",
  "Sony PlayStation Vita",
  "Sony PS Vita",
  "Sony PSVita",
]);

const PSX = new ConsoleNames("PSX", "PlayStation", [
  "PlayStation",
  "PS",
  "PS1",
  "PSX",
  "PSOne",
  "PlayStation 1",
  "PlayStation X",
  "PlayStation One",
]);

const PS2 = new ConsoleNames("PS2", "PlayStation 2", [
  "PlayStation 2",
  "PlayStation2",
  "PS2",
  "PS2 Slim",
  "PS2 Fat",
  "PS2 Phat",
  "PS2 Slimline",
  "Sony PlayStation 2",
  "Sony PS2",
  "Sony PlayStation2",
]);

const PS3 = new ConsoleNames("PS3", "PlayStation 3", [
  "PlayStation 3",
  "PlayStation3",
  "PS3",
  "PS3 Slim",
  "PS3 Super Slim",
  "PS3 Fat",
  "PS3 Phat",
  "Sony PlayStation 3",
  "Sony PS3",
  "Sony PlayStation3",
]);

const PS4 = new ConsoleNames("PS4", "PlayStation 4", [
  "PlayStation 4",
  "PlayStation4",
  "PS4",
  "PS4 Slim",
  "PS4 Pro",
  "PS4 Fat",
  "PS4 Phat",
  "Sony PlayStation 4",
  "Sony PS4",
  "Sony PlayStation4",
]);

const PS5 = new ConsoleNames("PS5", "PlayStation 5", [
  "PlayStation 5",
  "PlayStation5",
  "PS5",
  "PS5 Slim",
  "PS5 Pro",
  "PS5 Fat",
  "PS5 Phat",
  "Sony PlayStation 5",
  "Sony PS5",
  "Sony PlayStation5",
]);

/* MICROSOFT */

const Xbox = new ConsoleNames("XB", "Xbox", [
  "Xbox",
  "XB",
  "Xbox Original",
  "Xbox Classic",
  "Xbox 1st",
  "Xbox First",
  "Xbox 1st Gen",
  "Xbox First Gen",
  "Xbox 1st Generation",
  "Xbox First Generation",
  "Microsoft Xbox",
]);

const Xbox360 = new ConsoleNames("X360", "Xbox 360", [
  "Xbox 360",
  "Xbox360",
  "X360",
  "Xbox 360 Slim",
  "Xbox 360 Elite",
  "Xbox 360 Arcade",
  "Xbox 360 Pro",
  "Xbox 360 S",
  "Xbox 360 E",
  "Microsoft Xbox 360",
]);

const XboxOne = new ConsoleNames("XOne", "Xbox One", [
  "Xbox One",
  "XboxOne",
  "XOne",
  "Xbox One S",
  "Xbox One X",
  "Xbox One All-Digital",
  "Microsoft Xbox One",
]);

const XboxSeriesX = new ConsoleNames("XSS", "Xbox Series X", [
  "Xbox Series X",
  "XboxSeriesX",
  "XSeriesX",
  "Microsoft Xbox Series X",
]);

const XboxSeriesS = new ConsoleNames("XSS", "Xbox Series S", [
  "Xbox Series S",
  "XboxSeriesS",
  "XSeriesS",
  "Microsoft Xbox Series S",
]);

/* SEGA */

const Sega32X = new ConsoleNames("32X", "SEGA 32X", [
  "SEGA 32X",
  "32X",
  "Genesis 32X",
  "Mega Drive 32X",
  "Super 32X",
  "Super 32X System",
]);

const SegaCD = new ConsoleNames("SCD", "SEGA CD", [
  "SEGA CD",
  "SCD",
  "Mega CD",
  "Mega CD II",
  "SEGA CDX",
  "SEGA Multi-Mega",
  "SEGA Wondermega",
  "SEGA Wondermega M2",
  "SEGA Wondermega RG-M1",
  "SEGA Wondermega RG-M2",
  "SEGA Wondermega RG-M3",
  "Sega Mega-CD",
  "Sega Mega-CD II",
]);

const SegaMasterSystem = new ConsoleNames("SMS", "SEGA Master System", [
  "SEGA Master System",
  "Master System",
  "SMS",
  "SEGA Mark III",
  "Mark III",
  "SEGA Master System II",
  "Master System II",
  "SMS II",
  "SEGA Master System III",
  "Master System III",
  "SMS III",
]);

const SegaSaturn = new ConsoleNames("SAT", "SEGA Saturn", [
  "SEGA Saturn",
  "Saturn",
  "Saturno",
  "ST-V",
  "Sega Saturn",
  "SAT",
]);

const SegaGenesis = new ConsoleNames("GEN", "SEGA Genesis", [
  "SEGA Genesis",
  "Genesis",
  "Mega Drive",
  "MegaDrive",
  "MD",
  "SEGA Mega Drive",
  "SEGA MegaDrive",
  "SEGA MD",
  "SEGA Mega Drive II",
  "SEGA MegaDrive II",
  "SEGA MD II",
  "SEGA Mega Drive 2",
  "SEGA MegaDrive 2",
  "SEGA MD 2",
  "SEGA Mega Drive 3",
  "SEGA MegaDrive 3",
  "SEGA MD 3",
]);

const GameGear = new ConsoleNames("GG", "SEGA Game Gear", [
  "SEGA Game Gear",
  "Game Gear",
  "GG",
  "SEGA GG",
  "SEGA GameGear",
]);

const Dreamcast = new ConsoleNames("DC", "SEGA Dreamcast", [
  "SEGA Dreamcast",
  "Dreamcast",
  "DC",
  "Dreamcast 2",
  "Dreamcast II",
  "Dreamcast 128",
  "Dreamcast 2000",
  "Dreamcast 2001",
  "Dreamcast 2002",
]);

/* ATARI */

const Atari2600 = new ConsoleNames("2600", "Atari 2600", [
  "Atari 2600",
  "Atari2600",
  "2600",
  "VCS",
  "Atari Video Computer System",
  "Atari VCS",
  "Atari VCS 2600",
]);

const Atari5200 = new ConsoleNames("5200", "Atari 5200", [
  "Atari 5200",
  "Atari5200",
  "5200",
]);

const Atari7800 = new ConsoleNames("7800", "Atari 7800", [
  "Atari 7800",
  "Atari7800",
  "7800",
  "ProSystem",
  "Atari ProSystem",
]);

const Atari8Bit = new ConsoleNames("Atari8bit", "Atari 8-bit", [
  // Familia de computadoras Atari 8-bit
  "Atari 8-bit",
  "Atari8bit",
  "8-bit",
  "Atari 400",
  "Atari 800",
  "Atari 1200XL",
  "Atari 600XL",
  "Atari 800XL",
  "Atari 65XE",
  "Atari 130XE",
  "Atari 800XE",
  "Atari XEGS",
]);

const AtariLynx = new ConsoleNames("Lynx", "Atari Lynx", [
  "Atari Lynx",
  "Atari Lynx II",
  "AtariLynx",
  "Lynx",
]);

const AtariST = new ConsoleNames("ST", "Atari ST", [
  // Familia de computadoras Atari ST
  "Atari ST",
  "AtariST",
  "ST",
  "Atari 520ST",
  "Atari 520STm",
  "Atari 520STM",
  "Atari 1040STf",
  "Atari 1040STfm",
  "Atari 1040STe",
  "Atari 1040STE",
  "Atari Mega ST",
  "Atari Mega STe",
  "Atari Mega STE",
  "Atari STacy",
  "Atari ST Book",
]);

const Panasonic3DO = new ConsoleNames("3DO", "3DO Interactive Multiplayer", [
  "3DO",
  "3DO Interactive Multiplayer",
  "Panasonic 3DO",
  "Panasonic 3DO Interactive Multiplayer",
  "Panasonic FZ-1",
  "Panasonic FZ-10",
  "FZ-1 R.E.A.L. 3DO Interactive Multiplayer",
]);

const appleII = new ConsoleNames("AppleII", "Apple II", [
  "Apple II",
  "Apple II Plus",
  "Apple IIe",
  "Apple IIc",
  "Apple IIc Plus",
]);

const ClassicMacintosh = new ConsoleNames(
  "Macintosh",
  "Classic Macintosh",
  // Familia de computadoras Macintosh (classic)
  [
    "Classic Macintosh",
    "Macintosh",
    "Mac",
    "Macintosh 128K",
    "Macintosh 512K",
    "Macintosh Plus",
    "Macintosh SE",
    "Macintosh SE/30",
    "Macintosh Classic",
    "Macintosh Classic II",
    "Macintosh Color Classic",
    "Macintosh LC",
    "Macintosh LC II",
    "Macintosh LC III",
    "Macintosh LC 520",
    "Macintosh LC 550",
    "Macintosh LC 575",
    "Macintosh LC 580",
    "Macintosh LC 630",
    "Macintosh LC 630 DOS Compatible",
    "Macintosh LC 630 DOS",
    "Macintosh LC 630 DOS PC",
    "Macintosh LC 630 DOS PC Compatible",
    "Macintosh LC 630 PC Compatible",
    "Macintosh LC 630 PC",
    "Macintosh LC 630 PC DOS",
    "Macintosh LC 630 PC DOS Compatible",
    "Macintosh LC 630 DOS Compatible",
    "Macintosh LC 630 PC DOS Compatible",
    "Macintosh LC 630 DOS PC Compatible",
    "Macintosh LC 630 PC DOS PC Compatible",
    "Macintosh LC 630 PC DOS PC",
    "Macintosh LC 630 PC DOS PC",
    "Macintosh LC 630 PC DOS PC Compatible",
  ]
);

const CommodoreAmiga = new ConsoleNames("Amiga", "Commodore Amiga", [
  "Commodore Amiga",
  "Amiga",
  "Amiga 1000",
  "Amiga 500",
  "Amiga 600",
  "Amiga 1200",
  "Amiga 2000",
  "Amiga 3000",
  "Amiga 4000",
  "Amiga CD32",
  "Amiga CDTV",
]);

const WonderSwan = new ConsoleNames("WS", "WonderSwan", [
  "WS",
  "WonderSwan",
  "WonderSwan Color",
  "WonderSwan Crystal",
  "WonderSwan Black",
  "WonderSwan White",
  "WonderSwan SwanCrystal",
  "WonderSwan SwanCrystal Black",
  "WonderSwan SwanCrystal White",
]);

const TG16 = new ConsoleNames("TG16", "TurboGrafx-16", [
  "TG16",
  "TurboGrafx-16",
  "TurboGrafx 16",
  "TurboGrafx16",
  "TurboGrafx",
  "TurboGrafx 16",
  "TurboGrafx16",
  "NEC TurboGrafx-16",
  "NEC TurboGrafx 16",
  "NEC TurboGrafx16",
  "NEC TurboGrafx",
  "PC Engine",
  "PC-Engine SuperGrafx",
]);

const PCFX = new ConsoleNames("PCFX", "PC-FX", [
  "PCFX",
  "PC-FX",
  "PC Engine FX",
  "NEC PC-FX",
  "NEC PCFX",
  "NEC PC Engine FX",
]);

const NeoGeo = new ConsoleNames("NG", "Neo Geo", [
  "NG",
  "Neo Geo",
  "Neo-Geo",
  "NeoGeo",
  "Neo Geo AES",
  "Neo Geo CD",
  "Neo Geo Pocket",
  "Neo Geo Pocket Color",
  "Neo Geo X",
]);

const AtariJaguar = new ConsoleNames("Jaguar", "Atari Jaguar", [
  "Atari Jaguar",
  "Jaguar",
  "Atari Jaguar CD",
  "Jaguar CD",
]);

const Android = new ConsoleNames("Android", "Android", [
  "Android",
  "Android Phone",
  "Android Tablet",
]);

const iOS = new ConsoleNames("iOS", "iOS", ["iOS", "iPhone", "iPad", "iPod"]);

const macOS = new ConsoleNames("macOS", "macOS", ["macOS", "MacBook", "iMac"]);

export default {
  Nintendo3DS,
  NintendoDS,
  NintendoDSi,
  NintendoSwitch,
  Wii,
  WiiU,
  NES,
  SNES,
  N64,
  GameBoy,
  GameBoyColor,
  GameBoyAdvance,
  GameCube,
  PSP,
  PSVita,
  PSX,
  PS2,
  PS3,
  PS4,
  PS5,
  Xbox,
  Xbox360,
  XboxOne,
  XboxSeriesX,
  XboxSeriesS,
  Sega32X,
  SegaCD,
  SegaMasterSystem,
  SegaSaturn,
  SegaGenesis,
  GameGear,
  Dreamcast,
  Atari2600,
  Atari5200,
  Atari7800,
  Atari8Bit,
  AtariLynx,
  AtariST,
  AtariJaguar,
  Panasonic3DO,
  appleII,
  ClassicMacintosh,
  CommodoreAmiga,
  WonderSwan,
  TG16,
  PCFX,
  NeoGeo,
  Android,
  iOS,
  macOS,
};
