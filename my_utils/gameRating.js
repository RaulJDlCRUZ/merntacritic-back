export class ESRBRating {
  constructor() {}

  getRating(evaluate_rating) {
    const ratingsMap = {
      /* Everyone (E) */
      E: "E",
      Everyone: "E",
      /* Everyone 10+ (E10+) */
      E10: "E10+",
      Everyone10: "E10+",
      "E+10": "E10+",
      "Everyone 10+": "E10+",
      /* Teen (T) */
      T: "T",
      Teen: "T",
      /* Mature (M) */
      M: "M",
      Mature: "M",
      /* Adults Only (AO) */
      A: "AO",
      AO: "AO",
      Adult: "AO",
      "Adults Only": "AO",
      /* Rating Pending (RP) */
      RP: "RP",
      None: "RP",
      Pending: "RP",
      "Rating Pending": "RP",
    };

    return ratingsMap[evaluate_rating] || "RP";
  }
}

export class PEGIRating {
  constructor() {}

  getRating(evaluate_rating) {
    const ratingsMap = {
      /* Three (3) */
      3: "3",
      "3+": "3",
      "+3": "3",
      /* Seven (7) */
      7: "7",
      "7+": "7",
      "+7": "7",
      /* Twelve (12) */
      12: "12",
      "12+": "12",
      "+12": "12",

      /* Sixteen (16) */
      16: "16",
      "16+": "16",
      "+16": "16",
      /* Eighteen (18) */
      18: "18",
      "18+": "18",
      "+18": "18",
      /* Default or pending */
      None: "Pending",
      Pending: "Pending",
    };

    return ratingsMap[evaluate_rating] || "Pending";
  }
}

// console.log(new ESRBRating("Everyone 10+").getRating()); // Output: E10+
