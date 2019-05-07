const object = () => {
    this.obj = {};

    this.prop = (key: string, val: any) => {
        this.obj[key] = val;
        return this;
    };

    this.b = () => {
        return this.obj;
    };
};

const array = () => {
    this.arr = [];

    this.value = (val: any) => {
        this.arr.push(val);
        return this;
    };

    this.b = () => {
        return this.arr;
    };
};
