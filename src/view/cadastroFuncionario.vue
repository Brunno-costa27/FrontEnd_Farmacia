<template>
  <div>

  <a-form
    :form="form"
    @submit="handleSubmit"

  >
    <a-form-item v-bind="formItemLayout" label="Nome">
      <a-input v-model="nome" required/>
    </a-form-item>

    <a-form-item
      v-bind="formItemLayout"
      label="cpf"
      has-feedback
      v-mask="'###.###.###-##'"
    >
      <a-input v-model="cpf" required />
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="cargo" has-feedback>
      <a-input v-model="cargo" required />
    </a-form-item>

    <a-form-item v-bind="formItemLayout" label="Senha" has-feedback>
      <a-input type="password" v-model="senha" required />
    </a-form-item>

    <a-form-item v-bind="tailFormItemLayout">
      <a-button type="primary" html-type="submit" @click="voltar" >
        Registrar
          <router-link to="/painel"></router-link>
          <router-view />
        
      </a-button>
  
    </a-form-item>
    
  </a-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      nome: "",
      cpf: "",
      senha: "",
      cargo: "",
      messageError: null,
      message: null,
      active: false,
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 26,
            offset: 10,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`http://localhost:3333/funcionario`, {
          nome: this.nome,
          cpf: this.cpf,
          senha: this.senha,
          cargo: this.cargo,
        })
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          console.log(res.data.error);
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response.error);
        });
    },
    activeError() {
      if (this.messageError === "funcionario already exists") {
        this.active = true;
        this.cpf = "";
        this.senha = "";
        this.cargo = "";
        this.nome = "";
      } else if (this.message === "cadastrado com sucesso!") {
        console.log("deu certo");
      }
    },
    voltar(){
      return this.$router.go(-1);
    }
  },
};
</script>

<style scoped>

</style>>