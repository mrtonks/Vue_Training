var eventBus = new Vue()

Vue.component('product', {
    props: {
        cart: {
            type: Array,
            required: true
        },
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
        <div class="product">
            <div class="product-image">
                <img :src="image">
            </div>

            <div class="product-info">
                <h1>{{ title }}</h1>
                <!-- <p v-show="inStock">In Stock</p> -->
                <p v-if="inStock">In Stock</p>
                <!-- <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p> -->
                <p v-else>Out of Stock</p>
                <p>Shipping: {{ shipping }}</p>

                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <div v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    class="color-box"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)">
                </div>

                <button @click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to Cart</button>
                
                <button @click="removeFromCart"
                    :disabled="cart.length == 0"
                    :class="{ disabledButton: cart.length == 0 }">Remove from Cart</button>
            </div>

            <product-tabs :reviews="reviews"></product-tabs>
        </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: "Socks",
            description: "A pair of warm, fuzzy socks",
            details: ["80% cotton", "20% polyester", "Gender-neutral"],
            selectedVariant: 0,
            inventory: 5,
            link: 'http://www.github.com/mrtonks',
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                    
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 5
                }
            ],
            reviews: []
        } 
    },
    methods: {
        addToCart: function() {
            this.$emit('add-to-cart', ['add', this.variants[this.selectedVariant].variantId])
        },
        updateProduct(index) { // This does not works on all browsers
            this.selectedVariant = index
            console.log(index)
        },
        removeFromCart() {
            this.$emit('remove-from-cart', ['remove', this.variants[this.selectedVariant].variantId])
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

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

            <div class="radioButtons">
                <p>
                    <label>Would you recommend this product?</label>
                </p>

                <div>
                    <input 
                        type="radio" 
                        id="Yes" 
                        value="Yes" 
                        name="isRecommended"
                        v-model="isRecommended">
                    <label for="Yes">Yes</label>
                </div>

                <div>
                    <input 
                        type="radio" 
                        id="isRecommended" 
                        value="No" 
                        name="isRecommended"
                        v-model="isRecommended">
                    <label for="No">No</label>
                </div>
            </div>

            <p>
                <input type="submit" value="Submit">
            </p>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            isRecommended: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if (this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    isRecommended: this.isRecommended
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null 
                this.isRecommended = null   
            }
            else {
                if (!this.name) this.errors.push("Name required.")
                if (!this.review) this.errors.push("Review required.")
                if (!this.rating) this.errors.push("Rating required.")
                if (!this.isRecommended) this.errors.push("Recommendation required.")
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs" 
                :key="index"
                @click="selectedTab = tab"
                >{{ tab }}</span>

            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                        <p>{{ review.isRecommended }}</p>
                    </li>
                </ul>
            </div>
            
            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        cart: [],
        premium: false
    },
    methods: {
        updateCart(arr) {
            if (arr[0] === 'add') {
                this.cart.push(arr[1]);
            }
            else {
                let itemIdx = this.cart.indexOf(arr[1])
                if (itemIdx > -1) {
                    this.cart.splice(itemIdx, 1);
                }
            }
        }
    }
})