class Bejeweled {

    constructor() {
      this.score = 0;
      this.selected = null;
    }

    static changeSelected() {
        Bejeweled.selected = [1, 0];
    }
}

const bej = new Bejeweled();

Bejeweled.changeSelected();

console.log(Bejeweled.selected);
