export class austinCorgisRemoval {
  constructor() {
    this.filterlist = [1, 4, 6, 8, 14]
      .concat(Array.from({ length: 20 - 16 }, (_, i) => 16 + 1 + i))
      .concat(Array.from({ length: 25 - 21 }, (_, i) => 21 + 1 + i))
      .concat(Array.from({ length: 30 - 26 }, (_, i) => 26 + 1 + i))
      .concat(Array.from({ length: 35 - 31 }, (_, i) => 31 + 1 + i));
  }
  /*
    myRow =
    element["Title"] + " " +
    element["Features.Max Players"] + " " +
    element["Features.Multiplatform?"] + " " +
    element["Metadata.Genres"] + " " +
    element["Metadata.Publishers"] + " " +
    element["Metrics.Review Score"] + " " +
    element["Metrics.Sales"] + " " +
    element["Metrics.Used Price"] + " " +
    element["Release.Console"] + " " +
    element["Release.Rating"] + " " +
    element["Release.Year"] + " " +
    element["Length.All PlayStyles.Average"] + " " +
    element["Length.Completionists.Average"] + " " +
    element["Length.Main + Extras.Average"] + " " +
    element["Length.Main Story.Average"];
  */
}