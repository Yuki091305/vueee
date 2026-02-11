Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
            <div class="product-image">
                <img v-bind:alt="altText" :src="image" />
            </div>
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{ description}}</p>
                <a :href="Link">More products like this</a>
                 <p v-if="inventory > 10 && inStock > 0">In stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
                <p v-else :class="{'out-of-stock': !inStock }">Out of stock</p>
                <p>{{sale}}</p>
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>
                <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }" @mouseover="updateProduct(index)">
                </div>
                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>
                <div class="buttons">
                    <button v-on:click="addToCart">Add to cart</button>
                    <button v-on:click="deleteFromCart">Delete from cart</button>
                </div>
                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>
            </div>
        </div>`,
     data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            description: "A pair of warm, fuzzy socks",
            image: "./assets/vmSocks-green-onWhite.jpg",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inStock: true,
            inventory: 100,
            onSale: true,
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0,
        };
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        deleteFromCart() {
            if (this.cart > 0) {
                this.cart -= 1;
            }
        },
        updateProduct(index) {
            this.selectedVarian = index;
            console.log(index);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' ' + 'On sale';
            } else {
                return this.brand + ' ' + this.product + ' ' + 'Not on sale((';
            }
        },
        shipping() {
            return this.premium ? "Free" : 2.99;
        },
    },
})
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template:`
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>`
})


let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})



