<template>
  <a-layout id="components-layout-demo-side">
    <a-layout-sider v-model="collapsed" collapsible>
      <img src="../assets/farmacia.png" alt="não deu certo" id="logo" />
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
        <a-sub-menu>
          <span slot="title"
            ><a-icon type="user" /><span>{{ usuario }}</span></span
          >
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="team" /><span>Funções</span></span>
          <a-menu-item>
            <a @click="precoAparece">Cadastrar Ofertas</a>
          </a-menu-item>
          <a-menu-item>
            <a @click="() => (modal2Visible = true)">Cadastrar funcionarios</a>
          </a-menu-item>
          <a-menu-item>
             <a @click="sair">Sair</a>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item id="name">
            <div id="voltar">
              <template>
                 Seja bem-vindo {{ usuario }}
              </template>
            </div>
          </a-breadcrumb-item>
        </a-breadcrumb>

        <div
          :style="{ padding: '20px', background: '#fff', minHeight: '360px' }"
        >
          <div id="inform" v-if="active_boletim">
            <div>
              <div style="background: #ececec; padding: 30px">

                <Bar
                  v-if="loaded"
                  :chart-options="chartOptions"
                  :chart-data="chartData"
                  :chart-id="chartId"
                  :dataset-id-key="datasetIdKey"
                  :plugins="plugins"
                  :css-classes="cssClasses"
                  :styles="styles"
                  :width="width"
                  :height="height"
                />
              </div>
            </div>
          </div>

          <div v-if="active">
            <a-table
              :columns="columnsFuncionarios"
              :data-source="funcionarios"
              rowKey="key"
              id="tab"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button
              @click="tabelaFechar"
              type="danger"
              style="margin-top: 20px"
            >
              <a-icon type="close" />
            </a-button>
          </div>
          <!-- Tabela historico-->
          <div v-if="active4">
            <h1
              style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 20px;
                font-weight: bold;
              "
            >
              Lista de cargos admitidos
            </h1>
            <a-table
              :columns="columnsAuditoria"
              :data-source="auditoria"
              rowKey="key"
              id="tab"
            >
              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button
              @click="historicoFechar"
              type="danger"
              style="margin-top: 20px"
            >
              <a-icon type="close" />
            </a-button>
          </div>

          <div v-if="active1">
            <a-table
              :columns="columns"
              :data-source="requisições"
              rowKey="id"
              bordered
              id="tabela"
            >
              <template slot="status" slot-scope="text, record">

                <span v-if="record.status === 1">
                  <a-tag v-if="text === 1" color="blue">{{ processing }}</a-tag>
                </span>
                <span v-if="record.status === 2">
                  <a-tag v-if="text === 2" color="green">{{ confirm }}</a-tag>
                </span>
                <span v-if="record.status === 3">
                  <a-tag v-if="text === 3" color="red">{{ cancelado }}</a-tag>
                </span>
              </template>

              <template
                v-for="col in ['price']"
                :slot="col"
                slot-scope="text, record"
              >
                <div :key="col">
                  <a-input
                    v-if="record.editable"
                    style="margin: -5px 0"
                    :value="text"
                    @change="
                      (e) => handleChange(e.target.value, record.id, col)
                    "
                  />
                  <template v-else>
                    {{ text }}
                  </template>
                </div>
              </template>
              <template slot="operation" slot-scope="text, record">
                <div class="editable-row-operations">
                  <span v-if="record.editable">
                    <a-button @click="() => save(record.id)">Salvar</a-button>
                    <a-popconfirm
                      title="Certifique-se de cancelar?"
                      @confirm="() => cancel(record.id)"
                    >
                      <a-button type="danger" style="margin-left: 5px"
                        >Cancelar</a-button
                      >
                    </a-popconfirm>
                  </span>
                  <span v-if="!record.editable" id="buttonEditar">
                    <a-button
                      v-if="!record.price"
                      :disabled="record.status === 3"
                      @click="() => edit(record.id)"
                      >Lançar Ofertas</a-button
                    >
                  </span>
                  <span v-if="!record.editable" id="buttonEditar">
                    <a-button
                      type="primary"
                      v-if="record.price"
                      :disabled="editingKey !== ''"
                      @click="() => edit(record.id)"
                      >Editar</a-button
                    >
                    <a-button
                      type="danger"
                      style="margin-left: 5px"
                      v-if="record.price"
                      :disabled="editingKey !== ''"
                      @click="() => edit(record.id)"
                      >Deletar</a-button
                    >
                  </span>
                </div>
              </template>
            </a-table>
            <a-button
              @click="precoFechar"
              type="danger"
              style="margin-top: 20px max-width: 100%;"
            >
              <a-icon type="close" />
            </a-button>
          </div>

          <a-modal
            v-model="modal2Visible"
            title="Cadastro de Funcionários"
            centered
            @ok="
              () => (
                (modal2Visible = false), (active2 = false), (active3 = false)
              )
            "
          >
            <div>
              <a-form :form="form" @submit="handleSubmit">
                <a-form-item v-bind="formItemLayout" label="Nome">
                  <a-input v-model="nome" required />
                </a-form-item>

                <a-form-item
                  v-bind="formItemLayout"
                  label="cpf"
                  has-feedback
                  v-mask="'###.###.###-#'"
                >
                  <a-input v-model="cpf" required />
                </a-form-item>

                <a-form-item v-bind="formItemLayout" label="Senha" has-feedback>
                  <a-input type="password" v-model="senha" required />
                </a-form-item>

                <a-form-item v-bind="formItemLayout">
                  <a-button
                    type="primary"
                    html-type="submit"
                    @click="activeError"
                  >
                    Registrar
                  </a-button>
                  <a-alert
                    v-if="active2"
                    type="error"
                    message="funcionário já existe!"
                    style="text-align: center"
                  />
                  <a-alert
                    v-if="active3"
                    type="success"
                    message="funcionário cadastrado com sucesso!"
                    style="text-align: center"
                  />
                </a-form-item>
              </a-form>
            </div>
          </a-modal>
          <a-modal
            v-model="modal2Visible1"
            title="Excluir funcionarios"
            centered
            @ok="
              () => (
                (modal2Visible1 = false), (active2 = false), (active3 = false)
              )
            "
          >
            <div>
              <a-form :form="form" @submit="handleSubmit">
                <a-form-item
                  v-bind="formItemLayout"
                  label="cpf"
                  has-feedback
                  v-mask="'###.###.###-##'"
                >
                  <a-input v-model="cpf" required />
                </a-form-item>
                <a-form-item v-bind="formItemLayout">
                  <a-button
                    type="primary"
                    html-type="submit"
                    @click="activeError"
                  >
                    Excluir
                  </a-button>
                  <a-alert
                    v-if="active2"
                    type="error"
                    message="Funcionário já existe!"
                    style="text-align: center"
                  />
                  <a-alert
                    v-if="active3"
                    type="success"
                    message="O funcionário foi removido!"
                    style="text-align: center"
                  />
                </a-form-item>
              </a-form>
            </div>
          </a-modal>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import Funcionario from "../services/funcionarios";

import { Bar } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);
import axios from "axios";
const funcionarios = [];
const auditoria = [];
const requisições = [];

const columnsFuncionarios = [
  {
    title: "cpf",
    dataIndex: "cpf",
    key: "cpf",
    width: "15%",
  },
  {
    title: "nome",
    dataIndex: "nome",
    key: "nome",
    width: "50%",
  },
];

const columnsAuditoria = [
  {
    title: "cargo",
    dataIndex: "valor_novo",
    key: "valor_novo",
    width: "15%",
  },
  {
    title: "data",
    dataIndex: "data_changed",
    key: "data_changed",
    width: "10%",
  },
];

const columns = [
  {
    title: "Medicamento",
    dataIndex: "medicament",
    width: "17%",
    align: "center",
    scopedSlots: { customRender: "medicament" },
  },
  {
    title: "Quantidade",
    dataIndex: "quant",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "quant" },
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "3%",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "Valor",
    dataIndex: "price",
    width: "8%",
    align: "center",
    scopedSlots: { customRender: "price" },
  },
  {
    title: "Tipo",
    dataIndex: "type",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "Operação",
    dataIndex: "operation",
    width: "15%",
    align: "center",
    scopedSlots: { customRender: "operation" },
  },
];

export default {
  name: "BarChart",
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: "bar-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      columns,
      processing: "Em andamento",
      confirm: "confirmado",
      cancelado: "cancelado",
      columnsAuditoria,
      data: [],
      editingKey: "",
      collapsed: true,
      loaded: false,
      active: false,
      active1: false,
      active2: false,
      active3: false,
      active4: false,
      active_boletim: true,
      requisições,
      columnsFuncionarios,
      // columnsCadastroPreco,
      funcionarios,
      auditoria,
      usuario: "",
      modal2Visible: false,
      modal2Visible1: false,
      nome: "",
      cpf: "",
      senha: "",
      cargo: "",
      messageError: null,
      message: null,
      formItemLayout: {
        labelCol: {
          xs: { span: 40 },
          sm: { span: 40 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 24 },
        },
      },
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 2,
            offset: 1,
          },
          sm: {
            span: 1,
            offset: 7,
          },
        },
      },
      chartData: {
        labels: [
          "Total de solicitações",
          "Solicitações em andamento",
          "Solicitações confirmadas",
          "Solicitações canceladas",
        ],
        datasets: [
          {
            label: "Solicitações",
            data: [],
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgb(75, 192, 192)",
              "rgb(153, 102, 255)",
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(54, 162, 235)",
              "rgb(201, 203, 207)",
            ],
            borderWidth: 1,
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },

  async mounted() {
    this.loaded = false;
    try {
      let response = await axios.get(`http://127.0.0.1:5000/patients/requests`);
      let in_progress = 0;
      let confirmed = 0;
      let canceled = 0;
      this.requisições = response.data;
      this.update_solitacion(response.data.length);
      this.chartData.datasets[0].data[0] = response.data.length;
      this.requisições.forEach((requests) => {
        if (requests.status === 1) {
          in_progress = in_progress + 1;
        } else if (requests.status === 2) {
          confirmed = confirmed + 1;
        } else if (requests.status === 3) {
          canceled = canceled + 1;
        }
      });
      this.chartData.datasets[0].data[1] = in_progress;
      this.chartData.datasets[0].data[2] = confirmed;
      this.chartData.datasets[0].data[3] = canceled;
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }

    this.usuario = this.$route.params.usuario;

       if (sessionStorage.usuario) {
        this.usuario = sessionStorage.usuario;
      }else{
        sessionStorage.setItem('usuario', this.usuario)
      }
  },

  watch: {
    usuario(newName) {
     sessionStorage.usuario = newName;
     this.persist()
    }
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
    // console.log(this.form);
  },
  methods: {
    update_solitacion(val) {
      return (this.chartData.datasets[0].data[0] = val);
    },
     persist() {
      sessionStorage.usuario = sessionStorage.getItem("usuario");
    },

    sair(){
      sessionStorage.clear();
      this.$router.go()
    },

    handleSubmit(e) {
      e.preventDefault();
      axios
        .post(`http://127.0.0.1:8000/create`, {
          nome: this.nome,
          cpf: this.cpf,
          senha: this.senha,
        })
        .then((response) => {
          console.log("Entrou");
          this.message = response.status;
          console.log(response.data);
          this.activeError();
        })
        .catch((e) => {
          this.messageError = e.response.status;
          console.log(e.response.status);
          this.activeError();
        });
    },

    tabelaAparece() {
      this.active = true;
      this.active4 = false;
      this.active1 = false;
      this.active_boletim = false;
    },
    tabelaFechar() {
      this.active = false;
      this.active_boletim = true;
    },
    precoAparece() {
      this.active1 = true;
      this.active4 = false;
      this.active = false;
      this.active_boletim = false;
    },
    historicoAparece() {
      this.active4 = true;
      this.active = false;
      this.active1 = false;
      this.active_boletim = false;
    },
    historicoFechar() {
      this.active4 = false;
      this.active = false;
      this.active_boletim = true;
    },
    precoFechar() {
      this.active1 = false;
      this.active_boletim = true;
    },
    handleChange(value, id, column) {
      const newData = [...this.requisições];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        target[column] = value;
        this.requisições = newData;
      }
    },

    edit(id) {
      console.log("editar");
      const newData = [...this.requisições];
      const target = newData.filter((item) => id === item.id)[0];
      this.editingKey = id;

      if (target) {
        target.editable = true;
        this.requisições = newData;
      }
      target.price = "R$ ";
    },
    save(id) {
      const newData = [...this.requisições];
      // const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => id === item.id)[0];
      // console.log(target, "target");
      // const targetCache = newCacheData.filter(item => key === item.key)[0];
      // console.log(targetCache, 'targetCache');
      if (target) {
        delete target.editable;
        this.requisições = newData;
        Object.assign(target);
      }

      // Rota para enviar a solicitação de preço para o paciente
      // axios
      //   .post(`http://127.0.0.1:5000/requests/${id}/offers`, {
      //     medicament: target.medicament,
      //     type: target.type,
      //     price: target.price,
      //     status: target.status,
      //     id_request: id,
      //   })
      //   .then((res) => {
      //     this.messageError = res.data.error;
      //     this.message = res.data.message;
      //     this.activeError();
      //   })
      //   .catch((e) => {
      //     console.log(e.response);
      //   });

      // Rota para cadastrar ofertas no banco da farmácia
      axios
        .post(`http://127.0.0.1:8000/offers`, {
          medicament: target.medicament,
          type: target.type,
          price: target.price,
          status: target.status,
          id_request: target.id_patient,
        })
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response);
        });

      // this.requisições = this.requisições.filter((item) => item.id != id);
      // this.requesicoesAtualizadas = this.requisições;
      // console.log(this.requesicoesAtualizadas);
      this.editingKey = "";
      this.value = 1;
    },
    cancel(id) {
      console.log("cancelar");
      const newData = [...this.requisições];
      const target = newData.filter((item) => id === item.id)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(target);
        delete target.editable;
        this.requisições = newData;
      }

      target.price = "";
    },
    setModal1Visible(modal1Visible) {
      this.modal1Visible = modal1Visible;
    },
    activeError() {
      if (this.messageError === 400) {
        this.active2 = true;
        this.cpf = "";
        this.senha = "";
        this.cargo = "";
        this.nome = "";
      } else if (this.message === 201) {
        this.message = "Cadastrado com sucesso!";
        this.active2 = false;
        this.active3 = true;
        this.cpf = "";
        this.senha = "";
        this.cargo = "";
        this.nome = "";
        axios
          .get(`http://127.0.0.1:5000/patients/requests`)
          .then((resposta) => {
            this.requisições = resposta.data;
            this.usuario = this.$route.params.cpf;
            console.log('Está recebendo um usuario!');
            console.log(this.usuario);
          });

        //      axios
        // .get(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/auditoria?${Date.now()}`) // pegar da rota do azure portalfarmacia
        // .then((resposta) => {
        //   this.arrayAuxiliar = resposta.data;
        //   this.arrayAuxiliar.forEach((item) => {
        //     item.data_changed = item.data_changed
        //       .slice(0, 10)
        //       .split("-")
        //       .reverse()
        //       .join("/");
        //   });
        //   this.auditoria = this.arrayAuxiliar;
        //   // console.log(this.auditoria);
        // });
      }
      this.messageError = "";
      this.message = "";
    },
    activeError1() {
      if (this.messageError === "Funcionário não existe!") {
        this.active2 = true;
        this.cpf = "";
      } else if (this.message === "Apagado com sucesso!") {
        this.active2 = false;
        this.active3 = true;
        this.cpf = "";
        Funcionario.listar().then((resposta) => {
          this.funcionarios = resposta.data;
          this.usuario = this.$route.params.cpf;
           console.log('Está recebendo um usuario!');
            console.log(this.usuario);
        });
      }
      this.messageError = "";
      this.message = "";
    },
  },
};
</script>

<style>
#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
#components-layout-demo-side {
  min-height: 100vh;
  display: flex;
  width: 100%;
}

img {
  width: 100%;
}

#name {
  font-size: 30px;
}

#inform {
  /* margin-top: 60px; */
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#center_boletin {
  text-decoration: underline;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white;
  font-size: 30px;
}

#texto_boletim {
  text-decoration: none;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white;
  font-size: 30px;
}

#voltar {
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-weight: bold;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

#buttonEditar a {
  text-align: center;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: white;
}

.editable-row-operations {
  text-align: center;
  width: 100%;
  height: 100%;
  color: #e8e8e8;
  padding: 5px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.ant-table-row-cell-break-word {
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.editable-row-operations a {
  text-align: center;
  width: 100%;
  height: 100%;
  color: white;
  padding: 10px;
  background-color: #2c3e50;
  border-radius: 20px;
}

.ant-btn {
  background-color: white;
}

/* @media (min-width: 360px) and (max-width: 640px) {
  .ant-layout-content{
    display: none;
  }
} */
</style>
