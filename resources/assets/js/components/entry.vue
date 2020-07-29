<template>
  <b-jumbotron bg-variant="info" text-variant="white" border-variant="dark">
    <template v-slot:header>
      <span class="title">
        Cats By Breed
      </span>
    </template>

    <template v-slot:lead>
      This is a web application that uses laravel, vue js and graphql to display
      cats by breeds. The cats information is gotten from
      <b-link href="thecatsapi.com" variant="danger">Thecatsapi.com</b-link>
    </template>

    <hr class="my-4" />
    <div class="mt-10 d-flex"></div>

    <b-container fluid class="p-4 bg-dark">
      <b-row class="mb-3">
        <b-col cols="12">
          <h1 class="w-100 d-flex">Select</h1>
          <div class="position-relative w-100">
            <v-select
              :options="breeds"
              label="name"
              :reduce="breed => breed.id"
              class="select"
              v-model="breed_id"
            ></v-select>
            <b-overlay
              no-wrap
              :show="$apollo.queries.breeds.loading"
              spinner-variant="primary"
              spinner-small
            ></b-overlay>
          </div>
        </b-col>
      </b-row>
      <b-row class="position-relative item-container" fluid>
        <b-col
          class="my-3"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          xl="2"
          v-for="cat in cats"
          :key="cat.id"
        >
          <div class="img-container" :data-has-loaded="false">
            <b-img
              class="image"
              fluid
              @load="handleImageLoaded($event, cat.id)"
              :src="cat.image_url"
              :alt="`Cat Image ${cat.id}`"
            >
            </b-img>
            <div class="information">
              <div class="description">
                a good cat
              </div>
            </div>
            <b-overlay
              no-wrap
              :show="!hasLoaded(cat.id)"
              spinner-variant="primary"
              spinner-type="grow"
              spinner-small
            ></b-overlay>
          </div>
        </b-col>
        <b-overlay
          no-wrap
          :show="$apollo.queries.cats.loading"
          spinner-variant="primary"
        ></b-overlay>
      </b-row>
    </b-container>
  </b-jumbotron>
</template>

<style lang="less" scoped>
.item-container {
  min-height: 300px;
  max-width: 100%;
  width: 100%;
  margin: unset;
  padding: 0px 15px;
}

.img-container {
  border: 5px solid white;
  border-radius: 8px;
  position: relative;
  width: 100%;
  height: auto;
  background: white;
  overflow: hidden;
  height: 200px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.information {
  position: absolute;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  z-index: 11;
  bottom: 0;
  left: 0;
  transform: translateY(100%);
}

.select {
  border: 2px solid white;
  border-radius: 10px;

  ::v-deep {
    .vs__selected,
    .vs__input {
      color: white;
    }
  }
}
</style>

<script>
//bootstrap utilities for quick prototyping
import {
  BJumbotron,
  BLink,
  BCol,
  BRow,
  BImg,
  BContainer,
  BOverlay
} from 'bootstrap-vue';

import { getCats } from '@/graphql/queries/cat.gql';
import { getBreeds } from '@/graphql/queries/breed.gql';
import imageHasLoaded from 'imagesloaded';

export default {
  apollo: {
    cats: {
      query: getCats,
      variables() {
        return {
          breed_id: this.breed_id
        };
      },
      fetchPolicy: 'cache-and-network',
      pollInterval: 0,
      error(error) {
        const errMsg = error.graphQLErrors
          ? 'An error occured in the server while fetching cats data'
          : 'A network error occurred';

        this.$bvToast.toast(errMsg, {
          title: 'An error occurred',
          variant: 'danger',
          toaster: 'b-toaster-bottom-right',
          solid: true,
          autoHideDelay: 5000,
          appendToast: true
        });
      }
    },
    breeds: {
      query: getBreeds,
      fetchPolicy: 'cache-and-network',
      pollInterval: 0,
      error(error) {
        const errMsg = error.graphQLErrors
          ? 'An error occured in the server while fetching breeds data'
          : 'A network error occurred';

        this.$bvToast.toast(errMsg, {
          title: 'An error occurred',
          variant: 'danger',
          toaster: 'b-toaster-bottom-right',
          solid: true,
          autoHideDelay: 5000,
          appendToast: true
        });
      }
    }
  },
  components: {
    BJumbotron,
    BLink,
    BCol,
    BRow,
    BImg,
    BContainer,
    BOverlay
  },
  data: () => ({
    loaded: [],
    cats: [],
    callbacks: [],
    breedId: ''
  }),
  computed: {
    //computed method to check if an image has loaded
    hasLoaded() {
      return i => {
        return this.loaded.includes(i);
      };
    },
    //acts as a proxy to respond to breed_id changes and to get the underlying breed id
    breed_id: {
      get() {
        return this.breedId;
      },
      set(value) {
        this.cats = [];
        this.loaded = [];
        this.callbacks = [];
        this.breedId = value;
      }
    }
  },
  methods: {
    //removes loader only if image has loaded completely
    handleImageLoaded(e, i) {
      if (!(this.loaded.includes(i) || this.callbacks.includes(i))) {
        this.callbacks.push(i);
        imageHasLoaded(e.target, () => {
          this.loaded.push(i);
          this.$delete(
            this.callbacks,
            this.callbacks.findIndex(value => value === i)
          );
        });
      }
    }
  }
};
</script>
