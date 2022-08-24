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
            <a @click="tabelaAuditoria">Auditoria status</a>
          </a-menu-item>
          <a-menu-item>
           <a @click="tabelaAparece">Ofertas confirmadas</a>
          </a-menu-item>

          <a-menu-item>
           <a @click="historicoAparece">Ofertas em andamento</a>
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
                <a-avatar :size="50" src="https://joeschmoe.io/api/v1/random">
                </a-avatar>
                <span id="name">{{ usuario }}</span>
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



          <div v-if="auditoria_active">
            <!-- {{confirmOffers.length}} -->
              <h1
              v-if="auditoria.length === 0"
              style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 20px;
                font-weight: bold;
              "
            >
             Não existe mudanças 
            </h1>
            <a-table
              v-if="auditoria.length !== 0"
              :columns="columnsAuditoria"
              :data-source="auditoria"
              rowKey="key"
              id="tab"
            >

               <template slot="status" slot-scope="text, record">
                <!-- {{record.id_request}} -->

                <span v-if="record.status === 2">
                  <a-tag v-if="text === 2" color="green">{{ confirm }}</a-tag>
                </span>
              </template>

              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
             
            <a-button
              @click="tabelaFechar"
              type="danger"
              style="margin-top: 20px"
            >
              <!-- <a-icon type="close" /> -->
              Voltar
            </a-button>
          </div>

          <div v-if="active">
            <!-- {{confirmOffers.length}} -->
              <h1
              v-if="confirmOffers.length === 0"
              style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 20px;
                font-weight: bold;
              "
            >
             Não existe ofertas confirmadas
            </h1>
            <a-table
              v-if="confirmOffers.length !== 0"
              :columns="columnsOffersConfirm"
              :data-source="confirmOffers"
              rowKey="key"
              id="tab"
            >

               <template slot="status" slot-scope="text, record">
                <!-- {{record.id_request}} -->

                <span v-if="record.status === 2">
                  <a-tag v-if="text === 2" color="green">{{ confirm }}</a-tag>
                </span>
              </template>

              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
             
            <a-button
              @click="tabelaFechar"
              type="danger"
              style="margin-top: 20px"
            >
              <!-- <a-icon type="close" /> -->
              Voltar
            </a-button>
          </div>
          <!-- Tabela com ofertas em andamento e canceladas-->
          <div v-if="active4">
           
              <h1
                v-if="offerInProgress.length === 0"
                style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 20px;
                font-weight: bold;
              "
              >
                Não existe ofertas em andamento ou canceladas
              </h1>
            <a-table
              v-if="offerInProgress.length !== 0"
              :columns="columnsOffersInProgress"
              :data-source="offerInProgress"
              rowKey="key"
              id="tab"
            >

            <template slot="status" slot-scope="text, record">
                <!-- {{record.id_request}} -->

                <span v-if="record.status === 1">
                  <a-tag v-if="text === 1" color="blue">{{ processing }}</a-tag>
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
                      (e) => handleChange_offers(e.target.value, record.id_request, col)
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
                    <a-button @click="() => save_offers(record.id_request)">Salvar</a-button>
                    <a-popconfirm
                      title="Certifique-se de cancelar?"
                      @confirm="() => cancel_offers(record.id_request)"
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
                      @click="() => edit_offers(record.id_request)"
                      >Lançar Ofertas</a-button
                    >
                  </span>
                  <span v-if="!record.editable" id="buttonEditar">
                    <a-button
                      type="primary"
                      v-if="record.price"
                      :disabled="record.status === 3"
                      @click="() => edit_price(record.id_request)"
                      >Editar</a-button
                    >
                    <a-button
                      type="danger"
                      style="margin-left: 5px"
                      v-if="record.price"
                      :disabled="record.status === 3"
                      @click="() => editar_status(record.id_request)"
                      >Deletar</a-button
                    >
                  </span>
                </div>
              </template>

              <a slot="name" slot-scope="text">{{ text }}</a>
            </a-table>
            <a-button
              @click="historicoFechar"
              type="danger"
              style="margin-top: 20px"
            >
              <!-- <a-icon type="close" /> -->
              Voltar
            </a-button>
          </div>

          <div v-if="active1">

             <h1
              v-if="requisições.length === 0"
              style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 20px;
                font-weight: bold;
              "
            >
             Não existe nenhuma solicitação no momento.
            </h1>

            <a-table
              v-if="requisições.length !== 0"
              :columns="columns"
              :data-source="requisições"
              rowKey="key"
              bordered
              id="tabela"
            >
              <template slot="status" slot-scope="text, record">
                <!-- {{record.id}} -->

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
                      @click="() => edit_price(record.id)"
                      >Editar</a-button
                    >
                    <a-button
                      type="danger"
                      style="margin-left: 5px"
                      v-if="record.price"
                      :disabled="editingKey !== ''"
                      @click="() => editar_status(record.id)"
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
              <!-- <a-icon type="close" /> -->
              Voltar
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
import { message } from "ant-design-vue";
const confirmOffers = [];
const auditoria = [];
const offerInProgress = [];
const requisições = [];
const columnsOffersConfirm = [
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
];

const columnsOffersInProgress = [
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

const columnsAuditoria = [
  {
    title: "Data",
    dataIndex: "data_changed",
    width: "17%",
    align: "center",
    scopedSlots: { customRender: "data_changed" },
  },
  {
    title: "Operação",
    dataIndex: "operacao",
    width: "10%",
    align: "center",
    scopedSlots: { customRender: "operacao" },
  },
  {
    title: "Valor antigo",
    dataIndex: "valor_antigo",
    width: "3%",
    align: "center",
    scopedSlots: { customRender: "valor_antigo" },
  },
  {
    title: "Valor novo",
    dataIndex: "valor_novo",
    width: "8%",
    align: "center",
    scopedSlots: { customRender: "valor_novo" },
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
      valor_editar: false,
      processing: "Em andamento",
      confirm: "confirmado",
      cancelado: "cancelado",
      columnsOffersInProgress,
      data: [],
      editingKey: "",
      collapsed: true,
      loaded: false,
      active: false,
      active1: false,
      auditoria_active: false,
      active2: false,
      active3: false,
      active4: false,
      active_boletim: true,
      requisições,
      columnsOffersConfirm,
      columnsAuditoria,
      auditoria,
      confirmOffers,
      offerInProgress,
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

      let response = await axios.get(`http://127.0.0.1:5000/patients/requests`); // Lista com as requisições do banco do portal paciente
      // let response_offers = await axios.get(`http://127.0.0.1:8000/offers_all`); // Lista de ofertas do banco da farmácia
      let response_offers_patient = await axios.get(`http://127.0.0.1:5000/requests/offers`); // Lista de ofertas do banco paciente
      let in_progress = 0;
      let confirmed = 0;
      let canceled = 0;

      const results = response.data.filter(
        ({ id: id1 }) =>
          !response_offers_patient.data.some(({ id_request: id2 }) => id2 === id1)
      );

      

      this.requisições = results;
      this.confirmOffers = response_offers_patient.data.filter((item) => item.status === 2);
      this.offerInProgress = response_offers_patient.data.filter((item) => item.status === 1 || item.status === 3)
      
      let response_auditoria = await axios.get(`http://127.0.0.1:5000/requests/auditoria`);
      this.auditoria  = response_auditoria.data;

      this.update_solitacion(response.data.length);
      this.chartData.datasets[0].data[0] = response.data.length;
      response.data.forEach((requests) => {
        if (requests.status === 1) {
          in_progress = in_progress + 1;
        } else if (requests.status === 2) {
          confirmed = confirmed + 1;
        } else if (requests.status === 3) {
          canceled = canceled + 1;
        }
      });
      in_progress = this.offerInProgress.filter((item) => item.status === 1)
      canceled = this.offerInProgress.filter((item) => item.status === 3)
      this.chartData.datasets[0].data[1] = in_progress.length;
      this.chartData.datasets[0].data[2] = this.confirmOffers.length;
      this.chartData.datasets[0].data[3] = canceled.length;
      this.loaded = true;
    } catch (e) {
      console.error(e);
    }
      await this.send_email();

    this.usuario = this.$route.params.usuario;

    if (sessionStorage.usuario) {
      this.usuario = sessionStorage.usuario;
    } else {
      sessionStorage.setItem("usuario", this.usuario);
    }
  },

  watch: {
    usuario(newName) {
      sessionStorage.usuario = newName;
      this.persist();
    },
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "register" });
  },
  methods: {
    editar_status(id) {
      console.log(id);
      const key = "updatable";
      let status = 3;
      axios
        .patch(`http://127.0.0.1:5000/patients/offers/${id}/status`, {
          status: status,
        })
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response);
        });

      message.loading({ content: "Loading...", key });
      setTimeout(() => {
        message.success({ content: "Cancelado!", key, duration: 2 });
        document.location.reload(true);
      }, 1000);
    },

    async send_email() {
      
      try {
        let response = await axios.get(`http://127.0.0.1:5000/patients/requests`);
        let response_offers_patient = await axios.get(`http://127.0.0.1:5000/requests/offers`);

        const results = response.data.filter(
        ({ id: id1 }) =>
          response_offers_patient.data.some(({ id_request: id2 }) => id2 === id1)
      );
        let email_status = results.filter((item) => item.status === 2)
        console.log(email_status);
        email_status.forEach((requests) => {
          
          if (requests.status === 2) {
            //Rota para enviar o email de cofirmação para o paciente
            axios
              .post(`http://127.0.0.1:8000/email`, {
                email: requests.contact,
                nome: requests.name,
                medicament: requests.medicament,
                id_request: requests.id,
              })
              .then((res) => {
                this.messageError = res.data.error;
                this.message = res.data.message;
                this.activeError();
              })
              .catch((e) => {
                console.log(e.response);
              });
          }
        });
      } catch (e) {
        console.error(e);
      }
      
    },

    update_solitacion(val) {
      return (this.chartData.datasets[0].data[0] = val);
    },
    persist() {
      sessionStorage.usuario = sessionStorage.getItem("usuario");
    },

    sair() {
      sessionStorage.clear();
      this.$router.go();
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
      this.auditoria_active = false;
    },

    tabelaAuditoria() {
      this.auditoria_active = true;
      this.active = false;
      this.active4 = false;
      this.active1 = false;
      this.active_boletim = false;
    },
    tabelaFechar() {
      this.active = false;
      this.auditoria_active = false;
      this.active_boletim = true;
    },
    precoAparece() {
      this.active1 = true;
      this.active4 = false;
      this.active = false;
      this.active_boletim = false;
      this.auditoria_active = false;
    },
    historicoAparece() {
      this.active4 = true;
      this.active = false;
      this.active1 = false;
      this.active_boletim = false;
      this.auditoria_active = false;
    },
    historicoFechar() {
      this.active4 = false;
      this.active = false;
      this.auditoria_active = false;
      this.active_boletim = true;
    },
    precoFechar() {
      this.active1 = false;
      this.auditoria_active = false;
      this.active_boletim = true;
    },
    handleChange(value, id, column) {
      console.log(value);
      console.log(id);
      console.log(column);
      const newData = [...this.requisições];
      const target = newData.filter((item) => id === item.id)[0];
      if (target) {
        target[column] = value;
        this.requisições = newData;
      }
    },

     handleChange_offers(value, id, column) {
      console.log(value);
      console.log(id);
      console.log(column);
      const newData = [...this.offerInProgress];
      const target = newData.filter((item) => id === item.id_request)[0];
      if (target) {
        target[column] = value;
        this.offerInProgress = newData;
      }
    },

    edit(id) {
      console.log("editar");
      console.log(id);
      const newData = [...this.requisições];
      const target = newData.filter((item) => id === item.id)[0];
      this.editingKey = id;

      if (target) {
        target.editable = true;
        this.requisições = newData;
      }
      target.price = "R$ ";
    },

    edit_offers(id) {
      console.log("editar");
      console.log(id);
      const newData = [...this.offerInProgress];
      const target = newData.filter((item) => id === item.id_request)[0];
      this.editingKey = id;

      if (target) {
        target.editable = true;
        this.offerInProgress = newData;
      }
      target.price = "R$ ";
    },

    edit_price(id) {
      console.log("editar preço");
      console.log(id);
      this.valor_editar = true;
      const newData = [...this.offerInProgress];
      const target = newData.filter((item) => id === item.id_request)[0];
      this.editingKey = id;

      if (target) {
        target.editable = true;
        this.offerInProgress = newData;
      }
      target.price = "R$ ";
    },

    save_offers(id) {
      console.log('salvar');
      console.log(id);
      const key = "updatable";
      const newData = [...this.offerInProgress];
      // const newCacheData = [...this.cacheData];
      const target = newData.filter((item) => id === item.id_request)[0];
      // console.log(target, "target");
      // const targetCache = newCacheData.filter(item => key === item.key)[0];
      // console.log(targetCache, 'targetCache');
      if (target) {
        delete target.editable;
        this.offerInProgress = newData;
        Object.assign(target);
      }

      // Rota para enviar a solicitação de preço para o paciente
      axios
        .patch(`http://127.0.0.1:5000/patients/offers/${id}/price`, {
          price: target.price,
        })
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response);
        });

      // Rota para cadastrar ofertas no banco da farmácia
      // axios
      //   .post(`http://127.0.0.1:8000/offers`, {
      //     medicament: target.medicament,
      //     quant: target.quant,
      //     type: target.type,
      //     price: target.price,
      //     status: target.status,
      //     id_request: target.id,
      //   })
      //   .then((res) => {
      //     this.messageError = res.data.error;
      //     this.message = res.data.message;
      //     this.activeError();
      //   })
      //   .catch((e) => {
      //     console.log(e.response);
      //   });

      // this.requisições = this.requisições.filter((item) => item.id != id);
      // this.requesicoesAtualizadas = this.requisições;
      // console.log(this.requesicoesAtualizadas);
      this.editingKey = "";
      this.value = 1;
      if (this.valor_editar) {
        message.warning("Oferta atualizada com sucesso!");
        //  message.loading({ content: "Loading..."}, key);
      setTimeout(() => {
        message.warning({ content: "Oferta atualizada com sucesso!", key, duration: 2 });
        document.location.reload(true);
      }, 1000);
      } else {
        message.success("Oferta lançada com sucesso!");
        // message.loading({ content: "Loading...", key});
      setTimeout(() => {
        message.success({ content: "Oferta lançada com sucesso!", key, duration: 2 });
        document.location.reload(true);
      }, 1000);
      }
      this.valor_editar = false;


      // message.loading({ content: "Loading...", id});
      // setTimeout(() => {
      //   message.success({ content: "Cancelado!", id, duration: 2 });
      //   document.location.reload(true);
      // }, 1000);
    },

    save(id) {
      console.log('salvar');
      console.log(id);
      const key = "updatable";
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
      axios
        .post(`http://127.0.0.1:5000/requests/${id}/offers`, {
          medicament: target.medicament,
          quant: target.quant,
          type: target.type,
          price: target.price,
          status: target.status,
          id_request: target.id,
        })
        .then((res) => {
          this.messageError = res.data.error;
          this.message = res.data.message;
          this.activeError();
        })
        .catch((e) => {
          console.log(e.response);
        });

      // Rota para cadastrar ofertas no banco da farmácia
      // axios
      //   .post(`http://127.0.0.1:8000/offers`, {
      //     medicament: target.medicament,
      //     quant: target.quant,
      //     type: target.type,
      //     price: target.price,
      //     status: target.status,
      //     id_request: target.id,
      //   })
      //   .then((res) => {
      //     this.messageError = res.data.error;
      //     this.message = res.data.message;
      //     this.activeError();
      //   })
      //   .catch((e) => {
      //     console.log(e.response);
      //   });

      // this.requisições = this.requisições.filter((item) => item.id != id);
      // this.requesicoesAtualizadas = this.requisições;
      // console.log(this.requesicoesAtualizadas);
      this.editingKey = "";
      this.value = 1;
      if (this.valor_editar) {
        message.warning("Oferta atualizada com sucesso!");
      } else {
        message.success("Oferta lançada com sucesso!");
         setTimeout(() => {
        message.success({ content: "Oferta lançada com sucesso!", key, duration: 2 });
        document.location.reload(true);
      }, 500);
      }
      this.valor_editar = false;
    },

     cancel_offers(id) {
      console.log("cancelar");
      console.log(id);
      const newData = [...this.offerInProgress];
      const target = newData.filter((item) => id === item.id_request)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(target);
        delete target.editable;
        this.offerInProgress = newData;
      }

      target.price = "";
      message.error("Lançamento de oferta cancelada!");
    },

    cancel(id) {
      console.log("cancelar");
      console.log(id);
      const newData = [...this.requisições];
      const target = newData.filter((item) => id === item.id)[0];
      this.editingKey = "";
      if (target) {
        Object.assign(target);
        delete target.editable;
        this.requisições = newData;
      }

      target.price = "";
      message.error("Lançamento de oferta cancelada!");
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
            console.log("Está recebendo um usuario!");
            console.log(this.usuario);
          });

        //      axios
        // .get(`http://portalfarmacia.brazilsouth.cloudapp.azure.com:3333/offerInProgress?${Date.now()}`) // pegar da rota do azure portalfarmacia
        // .then((resposta) => {
        //   this.arrayAuxiliar = resposta.data;
        //   this.arrayAuxiliar.forEach((item) => {
        //     item.data_changed = item.data_changed
        //       .slice(0, 10)
        //       .split("-")
        //       .reverse()
        //       .join("/");
        //   });
        //   this.offerInProgress = this.arrayAuxiliar;
        //   // console.log(this.offerInProgress);
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
          console.log("Está recebendo um usuario!");
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
  font-weight: 100;
  display: flex;
  justify-content: right;
  align-items: left;
  /* background-color: red; */
}

#name{
  display: flex;
  justify-content: right;
  align-items: left;
  padding: 5px;
  margin-left: 5px;
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
