

let app = new Vue({
    el: '#list',
    data: {
        name: '',
        phonenumber: '',
        validation: false,
        cartinfo: 'Go To Cart',
        products: [],
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

    created:function(){

            fetch("http://localhost:3000/collections/products").then(function (response){
                response.json().then(
                    function (json){
                        app.products=json;
                    });

            });


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
            let ncart=[];
            let ndat={};
            for(let b=0;b<this.minicart.length;b++){
                let rspaces=this.itemCount(this.minicart[b].id);
                fetch("http://localhost:3000/collections/products/"+this.minicart[b].id,{
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    body:JSON.stringify({"count":rspaces})

                }).then(function(response){
                    response.text().then(
                        function (text){
                            console.log(text);
                        });

                });


                ndat={
                    id:this.minicart[b].id,
                    subject:this.minicart[b].subject,
                    location:this.minicart[b].location,
                    price:this.minicart[b].price,
                    spaces:this.cartCount(this.minicart[b].id)
                }
                ncart.push(ndat);
            }
            let newProduct={
                name: this.name,
                phonenumber: this.phonenumber,
                productDetails:ncart,
            };
            fetch("http://localhost:3000/collections/order",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                        },
                body:JSON.stringify(newProduct)

                }).then(function(response){
                response.text().then(
                    function (text){
                        console.log(text);
                    });

            });



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
        itemCount: function (id) {
            for (let i = 0; i < this.products.length; i++) {
                if (this.products[i].id === id) {
                    return this.products[i].count;
                }
            }
            return 0;
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
               // let foundsomething = false;
                let searchTerm=this.newTask.replace(/" "/g,"%20");
                console.log(searchTerm);
                fetch("http://localhost:3000/collections/products/search?q="+searchTerm,{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                    }

                }).then(function(response){
                    response.json().then(
                        function (json){
                            let finalSearch=[];
                            let arr1=[];
                            let arr2=[];
                            for(let i=0;i<2;i++){
                                 arr1=json[0];
                                 arr2=json[1];
                            }
                            for(let i=0;i<arr1.length;i++){
                                finalSearch.push(arr1[i]);
                            }
                            for(let ii=0;ii<arr2.length;ii++) {
                                let found=false;
                                for (let i = 0; i < arr1.length; i++) {
                                    if (arr2[ii].id == arr1[i].id){
                                        found=true;
                                    }
                                        }
                                if(found==false){
                                    finalSearch.push(arr2[ii]);
                                }
                            }
                            app.searched=finalSearch;
                            app.showpage("search");
                        });

                });

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