let eventBus = new Vue();

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
   
    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review"></textarea>
    </p>
    <p>
        <label>Would you recommend this product?</label><br>
        <input type="radio" id="recommend-yes" value="true" v-model="recommend">
        <label for="recommend-yes">Yes</label>
        
        <input type="radio" id="recommend-no" value="false" v-model="recommend">
        <label for="recommend-no">No</label>
    </p>
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>
    <p>
      <input type="submit" value="Submit Review">
    </p>
  </form>
  `,
    data() {
        return {
            name: '',
            review: '',
            rating: null,
            recommend: null,
            errors: []
        };
    },
    methods: {
        onSubmit() {
            this.errors = [];
            if (!this.name) this.errors.push("Name required.");
            if (!this.review) this.errors.push("Review required.");
            if (this.rating === null) this.errors.push("Rating required.");
            if (this.recommend === null) this.errors.push("Recommendation required.");

            if (this.errors.length === 0) {
                const productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend === 'true'
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = '';
                this.review = '';
                this.rating = null;
                this.recommend = null;
            }
        }
    }
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

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false,
            default: () => []
        },
        shippingInfo: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        },
    },
    template: `
    <div>   
        <ul>
            <span class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs"
                    @click="selectedTab = tab"
            >{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                    <p>Recommend: {{ review.recommend ? 'Yes' : 'No' }}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
        <div v-show="selectedTab === 'Shipping'">
            <h3>Shipping Information</h3>
            <p>{{ shippingInfo }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
            <h3>Details</h3>
            <ul>
                <li v-for="detail in details" :key="detail">{{ detail }}</li>
            </ul>
        </div>
    </div>
  </div>
  `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
})

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
                <a :href="link">More products like this</a>
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
                    <button v-on:click="addToCart" :disabled="inStock === 0":class="{ 'disabledButton': inStock === 0 }">
                    Add to cart
                    </button>
                    <button v-on:click="deleteFromCart">Delete from cart</button>
                </div>
                <product-tabs :reviews="reviews" :shipping-info="shipping" :details="details"></product-tabs>
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
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
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
            reviews: [],
        };
    },
    methods: {
        addToCart() {
            const id = this.variants[this.selectedVariant].variantId;
            console.log('Adding to cart, ID:', id);
            this.$emit('add-to-cart', id);
        },
        deleteFromCart() {
            const id = this.variants[this.selectedVariant].variantId;
            console.log('Deleting from cart, ID:', id);
            this.$emit('delete-from-cart', id);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log('Variant changed to index:', index);
        },
    },
    mounted() {
        eventBus.$on('review-submitted', (productReview) => {
            this.reviews.push(productReview);
        });
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

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeFromCart(id) {
            const index = this.cart.indexOf(id);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        },
    }
})



