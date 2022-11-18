import lessonproduct from './lesson.js'

let app = new Vue({
    el: '#list',
    data: {
        name: '',
        phonenumber: '',
        validation: false,
        cartinfo: 'Go To Cart',
        products: lessonproduct,
        cart: [],
        showcart: false,
        minicart: [],
        newTask: '',
        searched: [],
        showsearch: false,
        sortsubject: false,
        sortavailability: false,
        sortlocation: false,
        sortprice: false,
        sortascending: false,
        sortdescending: false
    },
    methods: {
        checkvalidation: function () {
            if (this.name.length != 0 && this.phonenumber.length != 0) {
                if (/^[a-zA-Z]+$/.test(this.name) && /^\d+$/.test(this.phonenumber) && this.name.length >= 2 && this.phonenumber.length >= 10) {
                    this.validation = true;
                } else {
                    this.validation = false;
                }
            }
        },
        finishcart: function () {
            alert("Order has been placed.For " + this.name + "  ," +
                "Contact Details: " + this.phonenumber);
            this.cart = [];
            this.minicart = [];
            this.showpage("home");
            this.name = '';
            this.phonenumber = '';
            this.validation = false;
        },
        addToCart: function (product) {

            if ((product.count) >= 1) {
                product.count = product.count - 1;
                this.cart.push(product);
                if (!(this.minicart.includes(product))) {
                    this.minicart.push(product);
                }
            }
        },
        canAddToCart: function (product) {
            return product.count >= 1;
        },
        cartCount: function (id) {
            let cartcount = 0;
            for (let i = 0; i < this.cart.length; i++) {
                if (this.cart[i].id === id) {
                    cartcount++;
                }
            }
            return cartcount;
        },
        cartout: function () {
            if (this.showcart) {
                this.showpage("home");
                this.cartinfo = "Go To Cart";
            } else {
                this.showpage("cart");
                this.cartinfo = "Go To Home";
            }
        },

        remove: function (product) {

            if (this.cart.includes(product)) {
                let index = this.cart.indexOf(product);
                this.cart.splice(index, 1);

                for (let i = 0; i < this.products.length; i++) {
                    if (product == this.products[i]) {

                        this.products[i].count = this.products[i].count + 1;
                    }
                }
            }
            if (this.cart.length == 0) {
                this.showpage("home");
            }
        },

        showpage: function (show) {
            if (show == "search") {
                this.showsearch = true;
                this.showcart
                    = false;
            }
            if (show == "home") {
                this.showsearch = false;
                this.showcart = false;
            }
            if (show == "cart") {
                this.showsearch = false;
                this.showcart = true;
            }
        },
        changes: function () {
            console.log(this.newTask);
            if (this.newTask.length == 0) {
                this.showpage("home");
                this.searched = [];
            } else {
                this.searched = [];
                let foundsomething = false;
                for (let i = 0; i < this.products.length; i++) {
                    let found = false;



                    if ((((this.products[i].subject).toUpperCase()).includes((this.newTask).toUpperCase()))) {
                        this.searched.push(this.products[i]);
                        this.showpage("search");
                        found = true;
                        foundsomething = true;
                    } else if ((((this.products[i].location).toUpperCase()).includes((this.newTask).toUpperCase())) && found == false) {
                        this.searched.push(this.products[i]);
                        this.showpage("search");
                        found = true;
                        foundsomething = true;
                    }
                }
                if (foundsomething == false) {
                    this.searched = [];
                    this.showpage("search");
                }
            }

        },
        shw: function () {
            let condition = false;
            if (this.sortascending == true && this.sortdescending == true) {
                condition = true;


                this.sortsubject = false;
                this.sortlocation = false;
                this.sortprice = false;
                this.sortavailability = false;
                this.sortdescending = false;
                this.sortascending = false;
                alert("Please choose just one feature ascending or descending")
            }
            if ((this.sortprice == false && this.sortlocation == false && this.sortavailability == false && this.sortsubject == false && (this.sortascending == true || this.sortdescending == true))) {
                condition = true;
                this.sortdescending = false;
                this.sortascending = false;
                alert("Please select a sort feature")

            }
            if ((this.sortprice == false && this.sortlocation == false && this.sortavailability == false && this.sortsubject == false && (this.sortascending == false && this.sortdescending == false))) {
                condition = true;
                alert("Please select a sort feature")

            }

            if ((this.sortprice == true && (this.sortlocation == false && this.sortavailability == false && this.sortsubject == false) && (this.sortascending !== this.sortdescending))) {
                condition = true;
                if (this.sortascending) {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            return parseFloat(a.price) - parseFloat(b.price);
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            return parseFloat(a.price) - parseFloat(b.price);
                        });
                    }

                } else {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            return parseFloat(b.price) - parseFloat(a.price);
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            return parseFloat(b.price) - parseFloat(a.price);
                        });
                    }
                }
            } else if ((this.sortlocation == true && (this.sortprice == false && this.sortavailability == false && this.sortsubject == false) && (this.sortascending !== this.sortdescending))) {
                condition = true;

                if (this.sortascending) {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            if (b.location.charAt(0) > a.location.charAt(0))
                                return -1;
                            if (b.location.charAt(0) < a.location.charAt(0))
                                return 1;
                            return 0;
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            if (b.location.charAt(0) > a.location.charAt(0))
                                return -1;
                            if (b.location.charAt(0) < a.location.charAt(0))
                                return 1;
                            return 0;
                        });
                    }
                } else {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            if (b.location.charAt(0) < a.location.charAt(0))
                                return -1;
                            if (b.location.charAt(0) > a.location.charAt(0))
                                return 1;
                            return 0;
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            if (b.location.charAt(0) < a.location.charAt(0))
                                return -1;
                            if (b.location.charAt(0) > a.location.charAt(0))
                                return 1;
                            return 0;
                        });
                    }
                }
            } else if ((this.sortavailability == true && (this.sortlocation == false && this.sortprice == false && this.sortsubject == false) && (this.sortascending !== this.sortdescending))) {
                condition = true;
                if (this.sortascending) {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            return parseFloat(a.count) - parseFloat(b.count);
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            return parseFloat(a.count) - parseFloat(b.count);
                        });
                    }
                } else {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            return parseFloat(b.count) - parseFloat(a.count);
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            return parseFloat(b.count) - parseFloat(a.count);
                        });
                    }
                }

            } else if ((this.sortsubject == true && (this.sortprice == false && this.sortavailability == false && this.sortlocation == false) && (this.sortascending !== this.sortdescending))) {
                condition = true;
                if (this.sortascending) {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            if (b.subject.charAt(0) > a.subject.charAt(0))
                                return -1;
                            if (b.subject.charAt(0) < a.subject.charAt(0))
                                return 1;
                            return 0;
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            if (b.subject.charAt(0) > a.subject.charAt(0))
                                return -1;
                            if (b.subject.charAt(0) < a.subject.charAt(0))
                                return 1;
                            return 0;
                        });
                    }
                } else {
                    if (this.showsearch == false) {
                        this.products.sort(function (a, b) {
                            if (b.subject.charAt(0) < a.subject.charAt(0))
                                return -1;
                            if (b.subject.charAt(0) > a.subject.charAt(0))
                                return 1;
                            return 0;
                        });
                    } else {
                        this.searched.sort(function (a, b) {
                            if (b.subject.charAt(0) < a.subject.charAt(0))
                                return -1;
                            if (b.subject.charAt(0) > a.subject.charAt(0))
                                return 1;
                            return 0;
                        });
                    }
                }
            } else {
                if (condition == false) {
                    alert("Please select only one sort feature")
                }

                condition = false;
            }

            if (condition == false) {
                this.sortsubject = false;
                this.sortlocation = false;
                this.sortprice = false;
                this.sortavailability = false;
                this.sortdescending = false;
                this.sortascending = false;
            }


        },


    },
    computed: {
        poundlogo() {
            return ('<i class="fa-solid fa-sterling-sign"></i>');

        },


    }
//do the serach and sorting start adding css
})