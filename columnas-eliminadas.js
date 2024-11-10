export class austinCorgisRemoval {
  constructor() {
    this.filterlist = [1, 4, 6, 8, 14]
      // Length de completitud de juego medido de otras formas no requeridas
      .concat(Array.from({ length: 20 - 16 }, (_, i) => 16 + 1 + i))
      .concat(Array.from({ length: 25 - 21 }, (_, i) => 21 + 1 + i))
      .concat(Array.from({ length: 30 - 26 }, (_, i) => 26 + 1 + i))
      .concat(Array.from({ length: 35 - 31 }, (_, i) => 31 + 1 + i));
  }
}

/* en bakikhan no se eliminarán columnas */

export class trungHoangRemoval {
  constructor() {
    this.filterlist = [0, 5, 6]
      .concat(Array.from({ length: 14 - 11 }, (_, i) => 11 + 1 + i))
      // Status que no se utilizará
      .concat(Array.from({ length: 26 - 20 }, (_, i) => 20 + 1 + i));
  }
}

export class mohamedTarekRemoval {
  constructor() {
    this.filterlist = [10, 11];
  }
}
