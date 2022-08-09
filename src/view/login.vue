<template>
  <div id="container">
    <a-form
      id="components-form-demo-normal-login"
      :form="form"
      class="login-form"
      @submit="handleSubmit"
      @click="activeError"
    >
      <a-form-item>
        <a-avatar :size="64" icon="user" id="avatar" />
        <a-input
          placeholder="Insira um usuario"
          type="text"
          
          v-model="usuario"
          required
        >
          <a-icon
            slot="prefix"
            type="user"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          type="password"
          placeholder="Insira uma senha"
          v-model="senha"
          required
        >
          <a-icon
            slot="prefix"
            type="lock"
            style="color: rgba(0, 0, 0, 0.25)"
          />
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
          style="background-color: white"
          color="white"
          html-type="submit"
          class="login-form-button"
        >
          Entrar
          <div v-if="active">
            <router-link to="/painel"></router-link>
            <router-view />
          </div>
        </a-button>
      </a-form-item>
      <a-alert v-if="active" type="error" show-icon message="Usuário e/ou senha inválidos" />
    </a-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  data() {
    return {
      usuario: "",
      senha: "",
      message: null,
      active: false,
    };
  },
  mounted() {
    // this.login();
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`http://127.0.0.1:8000/token/`, {
          username: this.usuario,
          password: this.senha,
        })
        .then((res) => {
          this.message = res.status;
          this.activeError();
        })
        .catch((e) => {
          console.log("Mensagem de erro", e.response.status);
          this.message = e.response.status;
          console.log(e.response.data);
           this.activeError();
        });
    },
    activeError() {
      if (this.message === 401) {
        this.message = "Funcionário não autenticado"
        this.active = true;
        this.usuario = "";
        this.senha = "";
      } else if (this.message === 200) {
        // this.login();
        sessionStorage.setItem('usuario', this.usuario);
        this.$router.push({ name: "painel", params: { usuario: this.usuario } });
      }
    },
  },
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
  color: #aeb0b4;
}
#avatar {
  margin-bottom: 30px;
  background-color: #2c3e50;
}
#container {
  background-color: white;
  padding: 30px;
  height: 400px;
  border-radius: 10px;
}
</style>