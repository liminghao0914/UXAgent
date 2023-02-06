<template>
  <app-layout>
    <!-- <router-link to="/404">NotFound</router-link> -->
    <div class="user-login">
      <v-snackbar v-model="snackbar" :timeout="timeout" top>
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title
                  >{{
                    isRegister ? stateObj.register.name : stateObj.login.name
                  }}
                  form</v-toolbar-title
                >
              </v-toolbar>
              <v-card-text>
                <form
                  ref="form"
                  @submit.prevent="isRegister ? register() : login()"
                >
                  <v-text-field
                    v-model="username"
                    name="username"
                    label="Username"
                    type="text"
                    placeholder="username"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    name="password"
                    label="Password"
                    type="password"
                    placeholder="password"
                    required
                  ></v-text-field>

                  <v-text-field
                    v-if="isRegister"
                    v-model="confirmPassword"
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    placeholder="cocnfirm password"
                    required
                  ></v-text-field>
                  <div class="red--text">{{ errorMessage }}</div>
                  <v-btn
                    type="submit"
                    class="mt-4"
                    color="primary"
                    value="log in"
                    >{{
                      isRegister ? stateObj.register.name : stateObj.login.name
                    }}</v-btn
                  >
                  <div
                    class="grey--text mt-4"
                    v-on:click="isRegister = !isRegister"
                  >
                    {{ toggleMessage }}
                  </div>
                </form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from "../components/AppLayout.vue";
import axios from "axios";
import global from "@/common.vue";

export default {
  name: "UserLogin",
  components: {
    AppLayout,
  },
  data() {
    return {
      username: "",
      password: "",
      confirmPassword: "",
      isRegister: false,
      errorMessage: "",
      stateObj: {
        register: {
          name: "Register",
          message: "Aleady have an Acoount? login.",
        },
        login: {
          name: "Login",
          message: "Register",
        },
      },
      snackbar: false,
      text: "",
      timeout: 2000,
    };
  },
  methods: {
    login() {
      let username = this.username;
      let password = this.password;
      let data = {
        username: username,
        password: password,
      };
      axios.post(global.httpUrl + "/validation", data).then((response) => {
        console.log(response);
        if (response.data.status == "success") {
          this.initData();
          localStorage.setItem("username", username);
          if(username == "admin"){
            this.$router.push("/admin");
          }else{
            this.$router.push("/list");
          }
        } else {
          this.errorMessage = response.data.status;
        }
      });
    },
    register() {
      if (this.password == this.confirmPassword) {
        let username = this.username;
        let password = this.password;
        let data = {
          username: username,
          password: password,
        };
        axios.post(global.httpUrl + "/registration", data).then((response) => {
          console.log(response);
          if (response.data.status == "success") {
            this.snackbar = true;
            this.text = "Registration Successful";
            this.initData();
          } else {
            this.errorMessage = response.data.status;
          }
        });
      } else {
        this.errorMessage = "password did not match";
      }
    },
    initData() {
      this.username = "";
      this.password = "";
      this.confirmPassword = "";
      this.isRegister = false;
      this.errorMessage = "";
      this.$refs.form.reset();
    },
  },
  computed: {
    toggleMessage: function () {
      return this.isRegister
        ? this.stateObj.register.message
        : this.stateObj.login.message;
    },
  },
};
</script>

<style lang="scss">
.user-login {
  width: 100%;
  height: 100%;
}
.grey--text{
  cursor: pointer;
}
</style>