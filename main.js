var eventBus = new Vue()

Vue.component('product', {
    props: {
       premium: {
           type: Boolean,
           required: true
       }
    },
    template: 
    `
    <div class = "product">
      
      <div class ="product-image">
        <img v-bind:src="image">
      </div>
      <div class ="URL">
        <a href="url">Visit our Site!</a>
      </div>

      <div class="product-info">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <p v-if="inStock">In Stock</p>
        <p v-else class="outOfStock">Out of Stock</p>
        <p v-if="onSale">On Sale!</p>
        <info-tabs :shipping="shipping" :details="details"></info-tabs>
        

        

        <div v-for="(variant, index) in variants" 
              :key="variant.variantId"
              class ="color-box"
              :style="{backgroundColor: variant.variantColor}"
              @mouseover="updateProduct(index)">
        </div>
        

         
        <button v-on:click="addToCart" 
                :disabled="!inStock"
                class="{disabledButton: !inStock}">Add to Cart</button>
        <button @click="removeFromCart">
          Remove from cart
        </button>
        </div>
        <product-tabs :reviews="reviews"></product-tabs>


      
      </div>
    `,
    data() {
        return {brand: 'Vue Mastery',
        product: 'Socks',
        description: 'Original Socks',
        selectedVariant: 0,
        url: 'file:///D:/Internship/JavaScript/vue/index.html',
        onSale: true,
        details:["80% cotton", "20% polyester", "Gender-neutral"],
        variants: [
            {
                variantId: 1100,
                variantColor: "gray",
                variantImage: './socks.jpg',
                variantQuantity: 10,
            },
            {
                variantId: 1101,
                variantColor: "black",
                variantImage: './blacksocks.jpg',
                variantQuantity: 0,

            }
        ],
        reviews: []
    
    }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },

        updateProduct(index) {
            this.selectedVariant = index
            console.log(index)
        },
        removeFromCart() {
          this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
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
            if(this.premium) {
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
  
  <form class = "review-form" @submit.prevent="onSubmit">
  
  <p v-if="errors.length">
    <b>Please correct the following error(s): </b>
    <ul>
      <li v-for="error in errors">{{ error }}</li>
    </ul>
  </p>
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name">
  </p>
  <p>
    <label for="review"> Review:</label>
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

    <label for="recomand">Would you recomand this product?</label>
    <select id="recomand" v-model="recomand">
      <option> Yes </option>
      <option> No </option>
    </select>
  </p>
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
      recomand: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      if(this.name && this.review && this.rating && this.recomand) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recomand: this.recomand
        }
        eventBus.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
        this.recomand=null
      }
      else{
        if(!this.name) this.errors.push("Name required")
        if(!this.review) this.errors.push("Review required")
        if(!this.rating) this.errors.push("Rating required")
        if(!this.recomand) this.errors.push("Recommandation required")
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
      :class="{activeTab: selectedTab === tab}"
      v-for="(tab, index) in tabs" :key="index"
      @click="selectedTab = tab">
      {{ tab }}</span>
    
      <div v-show="selectedTab === 'Reviews'">
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>{{ review.review }}</p>
          <p>Review: {{ review.rating }}</p>
          <p>Recomandation: {{ review.recomand }}</p>
        </li>
      </ul>
      </div>
      <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
      </div>
    </div>
    

  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
}),
Vue.component('info-tabs', {
  props: {
    shipping: {
      required: true
    },
    details: {
      type: Array,
      required: true
    }
  },
  template: `
  <div>
      
        <ul>
          <span class="tabs" 
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="tab"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
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
      tabs: ['Shipping', 'Details'],
      selectedTab: 'Shipping'
    }
  }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
          for(var i = this.cart.length - 1; i>=0; i--) {
            if(this.cart[i] === id) {
              this.cart.splice(i,1)
            }
          }
        }
    }
    
})
