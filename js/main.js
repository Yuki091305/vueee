let eventBus = new Vue()

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
                <label for="recommend">Would you recommend this product?</label>
                <input type="radio" id="recommend-yes" value="true" v-model="recommend">
                <label for="recommend-yes"> Yes </label>

                <input type="radio" id="recommend-no" value="false" v-model="recommend">
                <label for="recommend-no"> No </label>
            </p>
            <p>
                <input type="submit" value="Submit"> 
            </p>
        </form>
 `,
   data() {
   return {
        name: "",
        review: "",
        rating: null,
        errors: [],
        recommend: "",
   }
},methods:{
        onSubmit() {
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend === 'true',
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommend required")
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
    </ul>
    `
});
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: false
        },
        details: {
            type: Array,
            required: false
        }
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
           <p>Recommend: {{ review.recommend ? 'Yes' : 'No' }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Shipping'">
         <p>Shipping: {{ shipping }}</p>
       </div>
       <div v-show="selectedTab === 'Details'">
         <ul>
           <li v-for="detail in details">{{ detail }}</li>
         </ul>
       </div>
     </div>
`,
   data() {
       return {
           tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
           selectedTab: 'Reviews' ,
       }  
   },
})


Vue.component('product', {
    props: {
        premium: {
           type: Boolean,
           required: true
       },
    },
   template: `
   <div class="product">
       <div class="product-image">
           <img :src="image" :alt="altText" />
       </div>
       <div class="product-info">
           <h1>{{ title }}</h1>
            <p>{{ description }}</p>
            <a :href="link">  More products like this </a>
            <p v-if="inStock">In Stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else :class="{'line': !inStock}">Out of stock</p>
            <p>{{ sale }}</p>
            <p>Shipping: {{ shipping }}</p>
            <product-details :details = "details"></product-details>
           <div
       class="color-box"
       v-for="(variant, index) in variants"
       :key="variant.variantId"
       :style="{ backgroundColor:variant.variantColor }"
       @mouseover="updateProduct(index)">
            </div>
            <ul>
               <li v-for="sizes in sizes">{{ sizes }}</li>
            </ul>
            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
               Add to cart
            </button>
            <button v-on:click="deleteToCart">Delete to cart</button>
         </div>
        <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>
    </div>
 `,
    data() {
       return {
        product: "Socks",
        reviews: [],
        brand: 'Vue Mastery',
        description: "A pair of warm, fuzzy socks",
        selectedVariant: 0,
        altText: "A pair of socks",
        link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
        inventory: 100,
        onSale: true,
        details: ['80% cotton', '20% polyester', 'Gender-neutral'],
        variants: [{
            variantId: 2234,
            variantColor: 'green',
            variantImage: "./assets/vmSocks-green-onWhite.jpg",
            variantQuantity: 10 
        },
        {
            variantId: 2235,
            variantColor: 'blue',
            variantImage: "./assets/vmSocks-blue-onWhite.jpg",
            variantQuantity: 10
        }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    }
    },
   methods: {
        addToCart() {
            const id = this.variants[this.selectedVariant].variantId;
            console.log('Добавляем в корзину ID:', id)
            this.$emit('add-to-cart', id);
        },
        deleteToCart(){
const id = this.variants[this.selectedVariant].variantId;
            console.log('Удаляем из корзины ID:', id)
            this.$emit('remove-from-cart', id)
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
   },
   mounted() {
            eventBus.$on('review-submitted', productReview => {
                this.reviews.push(productReview)
            })
        },

   computed: {
    title() {
       return this.brand + ' ' + this.product;
    },
    image() {
        return this.variants[this.selectedVariant].variantImage;
    },
    inStock(){
        return this.variants[this.selectedVariant].variantQuantity > 0;
    },
    sale(){
        if(this.onSale){
            return this.brand + ' ' + this.product + 'is on sale!';
        } else {
            return this.brand + ' ' + this.product + 'is not on sale.';
        }
    },
       shipping() {
        if (this.premium){
            return "Free";
        } else {
            return 2.99
        }
    },
   }
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

    decreaseCart(id){
        const index = this.cart.indexOf(id);
        if(index !== -1){
            this.cart.splice(index, 1);
        }
    },
   }
});