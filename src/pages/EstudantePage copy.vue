<template>
  <q-layout view="hHh LpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img :src="userAvatar">
        </q-avatar>
        <q-toolbar-title>
          {{ userNome }}
          <template v-if="userInfo">
            <div class="text-caption">{{ userInfo.nivel || 'Estudante' }}</div>
          </template>
        </q-toolbar-title>

        <!-- Saldo -->
        <q-chip dense class="bg-white text-primary q-mr-sm">
          <q-avatar icon="account_balance_wallet" color="primary" text-color="white" />
          {{ formatarPreco(saldo) }}
        </q-chip>

        <q-btn flat round dense icon="notifications">
          <q-badge color="red" floating>{{ notificacoesNaoLidas }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Navegação Inferior -->
    <q-footer class="bg-white text-dark">
      <q-tabs v-model="tab" dense class="text-grey-7" active-color="primary" indicator-color="primary" align="justify">
        <q-tab name="pedidos" icon="list" label="Pedidos">
          <q-badge v-if="pedidosAtivos > 0" color="red" floating>{{ pedidosAtivos }}</q-badge>
        </q-tab>
        <q-tab name="biblioteca" icon="menu_book" label="Biblioteca">
          <q-badge v-if="bibliotecaCount > 0" color="primary" floating>{{ bibliotecaCount }}</q-badge>
        </q-tab>
        <q-tab name="loja" icon="store" label="Loja" />
        <q-tab name="perfil" icon="person" label="Perfil" />
      </q-tabs>
    </q-footer>

    <!-- Conteúdo Principal -->
    <q-page-container>
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <q-spinner color="primary" size="3em" />
        <p class="q-mt-md">Carregando...</p>
      </div>

      <!-- Conteúdo -->
      <template v-else>
        <!-- PEDIDOS -->
        <q-page v-if="tab === 'pedidos'" class="q-pa-md">
          <!-- Botão Novo Pedido -->
          <div class="row q-mb-md">
            <q-btn color="primary" label="+ Novo Pedido" icon="add" class="full-width" @click="novoPedidoDialog = true" />
          </div>

          <!-- Filtros -->
          <div class="row q-mb-md">
            <q-btn-toggle
              v-model="filtroPedidos"
              toggle-color="primary"
              :options="[
                { label: 'Todos', value: 'todos' },
                { label: 'Ativos', value: 'ativos' },
                { label: 'Concluídos', value: 'concluidos' }
              ]"
              spread
              unelevated
              dense
            />
          </div>

          <!-- Lista de Pedidos -->
          <div class="row q-col-gutter-md">
            <div v-if="pedidosFiltrados.length === 0" class="col-12 text-center q-py-xl">
              <q-icon name="inbox" size="64px" color="grey-3" />
              <div class="text-h6 text-grey-7 q-mt-md">Nenhum pedido encontrado</div>
              <q-btn color="primary" label="Criar primeiro pedido" class="q-mt-md" @click="novoPedidoDialog = true" />
            </div>

            <div v-for="pedido in pedidosFiltrados" :key="pedido.id" class="col-12">
              <q-card flat bordered class="pedido-card">
                <q-card-section>
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar :color="getCorMateria(pedido.materia)" text-color="white" size="36px" class="q-mr-sm">
                        <q-icon :name="getIconeMateria(pedido.materia)" size="20px" />
                      </q-avatar>
                      <div>
                        <div class="text-subtitle2 text-weight-bold">{{ pedido.titulo }}</div>
                        <div class="row items-center">
                          <q-icon name="schedule" size="14px" class="text-grey-7 q-mr-xs" />
                          <span class="text-caption text-grey-7">{{ formatarData(pedido.created_at) }} • {{ pedido.duracao }}</span>
                        </div>
                      </div>
                    </div>
                    <q-chip :color="getStatusCor(pedido.status)" text-color="white" size="sm">
                      {{ pedido.status }}
                    </q-chip>
                  </div>

                  <!-- Propostas -->
                  <div v-if="pedido.propostas && pedido.propostas.length > 0 && pedido.status === 'Em negociação'" class="q-mt-md">
                    <div class="text-caption text-weight-bold q-mb-xs">📩 {{ pedido.propostas.length }} proposta(s):</div>
                    <div v-for="prop in pedido.propostas" :key="prop.id" class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders q-mb-xs">
                      <div class="row items-center">
                        <q-avatar size="28px" class="q-mr-xs">
                          <img :src="prop.explicador?.avatar || 'https://cdn.quasar.dev/img/avatar3.jpg'">
                        </q-avatar>
                        <div>
                          <div class="row items-center">
                            <span class="text-caption text-weight-bold">{{ prop.explicador?.nome || 'Explicador' }}</span>
                            <!-- <q-rating v-model="prop.explicador?.avaliacao" size="14px" :max="5" color="accent" readonly class="q-ml-xs" /> -->
                          </div>
                          <div class="text-caption text-grey-7">{{ prop.explicador?.materias?.join(', ') || 'Matemática' }}</div>
                        </div>
                      </div>
                      <div class="row items-center">
                        <div class="text-primary text-weight-bold q-mr-md">{{ formatarPreco(prop.valor) }}</div>
                        <q-btn flat round color="positive" icon="check" size="sm" @click="aceitarProposta(prop.id)">
                          <q-tooltip>Aceitar proposta</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>

                  <!-- Explicador Aceito -->
                  <div v-if="pedido.explicador && pedido.status === 'Aceito'" class="q-mt-md bg-positive-light q-pa-sm rounded-borders">
                    <div class="row items-center justify-between">
                      <div class="row items-center">
                        <q-avatar size="32px" class="q-mr-sm">
                          <img :src="pedido.explicador.avatar || 'https://cdn.quasar.dev/img/avatar3.jpg'">
                        </q-avatar>
                        <div>
                          <div class="row items-center">
                            <span class="text-caption text-weight-bold">{{ pedido.explicador.nome }}</span>
                            <q-rating v-model="pedido.explicador.avaliacao" size="14px" :max="5" color="accent" readonly class="q-ml-xs" />
                          </div>
                          <div class="text-caption text-grey-7">{{ pedido.explicador.materias?.join(', ') || pedido.materia }}</div>
                        </div>
                      </div>
                      <div class="text-primary text-weight-bold">{{ formatarPreco(pedido.preco_combinado || pedido.preco) }}</div>
                    </div>
                    <div class="row q-mt-md q-col-gutter-sm">
                      <div class="col-6">
                        <q-btn flat label="Chat" color="primary" icon="chat" class="full-width" @click="abrirChat(pedido.explicador)" />
                      </div>
                      <div class="col-6">
                        <q-btn flat label="Detalhes" color="secondary" icon="info" class="full-width" @click="verDetalhesPedido(pedido)" />
                      </div>
                    </div>
                  </div>

                  <!-- Avaliação -->
                  <div v-if="pedido.status === 'Concluído' && !pedido.avaliado" class="q-mt-md">
                    <div class="text-caption q-mb-xs">Avalie sua experiência:</div>
                    <div class="row items-center justify-between">
                      <q-rating v-model="pedido.avaliacaoTemp" size="1.5em" :max="5" color="accent" />
                      <q-btn flat label="Enviar" color="primary" size="sm" @click="avaliarPedido(pedido)" />
                    </div>
                  </div>

                  <!-- Rodapé -->
                  <div class="row items-center justify-between q-mt-md">
                    <div class="row items-center">
                      <q-icon name="visibility" size="16px" class="text-grey-7 q-mr-xs" />
                      <span class="text-caption text-grey-7">{{ pedido.visualizacoes || 0 }} visualizações</span>
                    </div>
                    <q-btn flat label="Ver detalhes" color="primary" size="sm" @click="verDetalhesPedido(pedido)" />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- BIBLIOTECA -->
        <q-page v-if="tab === 'biblioteca'" class="q-pa-md">
          <div class="row q-mb-md">
            <div class="col-12">
              <div class="text-h6">Minha Biblioteca</div>
              <div class="text-caption text-grey-7">{{ biblioteca.length }} itens</div>
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div v-if="biblioteca.length === 0" class="col-12 text-center q-py-xl">
              <q-icon name="menu_book" size="64px" color="grey-3" />
              <div class="text-h6 text-grey-7 q-mt-md">Sua biblioteca está vazia</div>
              <q-btn color="primary" label="Explorar conteúdos" class="q-mt-md" @click="tab = 'loja'" />
            </div>

            <div v-for="item in biblioteca" :key="item.id" class="col-6 col-md-3">
              <q-card flat bordered class="biblioteca-card">
                <q-img :src="item.conteudo?.capa || 'https://cdn.quasar.dev/img/mountains.jpg'" ratio="1">
                  <div class="absolute-top-right q-pa-xs">
                    <q-btn flat round dense color="red" :icon="item.favorito ? 'favorite' : 'favorite_border'" size="sm" @click="toggleFavorito(item)" />
                  </div>
                  <div class="absolute-bottom">
                    <div class="text-caption text-weight-bold">{{ item.conteudo?.titulo || 'Conteúdo' }}</div>
                  </div>
                </q-img>
                <q-card-section class="q-pa-xs">
                  <div class="row items-center justify-between">
                    <span class="text-caption text-grey-7">{{ item.conteudo?.explicador?.nome || 'Explicador' }}</span>
                    <q-linear-progress :value="item.progresso / 100" color="primary" size="4px" style="width: 50px" rounded />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- LOJA -->
        <q-page v-if="tab === 'loja'" class="q-pa-md">
          <div class="row q-mb-md">
            <div class="col-12">
              <div class="text-h6">Loja de Conteúdos</div>
              <div class="text-caption text-grey-7">Aprenda com os melhores</div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="row q-mb-md">
            <q-input v-model="buscaConteudos" outlined dense placeholder="Buscar..." class="col-12 col-md-6">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>

          <div class="row q-mb-md">
            <q-btn-toggle
              v-model="filtroMateria"
              toggle-color="primary"
              :options="[
                { label: 'Todos', value: 'todos' },
                { label: 'Matemática', value: 'Matemática' },
                { label: 'Física', value: 'Física' },
                { label: 'Química', value: 'Química' },
                { label: 'Português', value: 'Português' }
              ]"
              spread
              unelevated
              dense
            />
          </div>

          <!-- Grid de Conteúdos -->
          <div class="row q-col-gutter-md">
            <div v-if="conteudos.length === 0" class="col-12 text-center q-py-xl">
              <q-icon name="store" size="64px" color="grey-3" />
              <div class="text-h6 text-grey-7 q-mt-md">Nenhum conteúdo encontrado</div>
            </div>

            <div v-for="item in conteudosFiltrados" :key="item.id" class="col-6 col-md-3">
              <q-card flat bordered class="conteudo-card" @click="verDetalhesConteudo(item)">
                <q-img :src="item.capa || 'https://cdn.quasar.dev/img/mountains.jpg'" ratio="1">
                  <div class="absolute-top-left q-pa-xs">
                    <q-badge :color="item.materia === 'Matemática' ? 'primary' : 'secondary'">
                      {{ item.materia }}
                    </q-badge>
                  </div>
                  <div class="absolute-bottom bg-transparent">
                    <div class="text-right">
                      <q-badge color="primary">{{ formatarPreco(item.preco) }}</q-badge>
                    </div>
                  </div>
                </q-img>
                <q-card-section class="q-pa-xs">
                  <div class="text-caption text-weight-bold lines-2">{{ item.titulo }}</div>
                  <div class="row items-center q-mt-xs">
                    <q-avatar size="16px" class="q-mr-xs">
                      <img :src="item.explicador?.avatar || 'https://cdn.quasar.dev/img/avatar3.jpg'">
                    </q-avatar>
                    <span class="text-caption text-grey-7">{{ item.explicador?.nome || 'Explicador' }}</span>
                  </div>
                  <div class="row items-center q-mt-xs">
                    <q-rating v-model="item.avaliacao" size="12px" :max="5" color="accent" readonly />
                    <span class="text-caption q-ml-xs">({{ item.avaliacoes || 0 }})</span>
                  </div>
                  <q-btn flat color="primary" label="Comprar" size="sm" class="full-width q-mt-xs" @click.stop="comprarConteudo(item)" />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- PERFIL -->
        <q-page v-if="tab === 'perfil'" class="q-pa-md">
          <div class="text-center q-mb-lg">
            <q-avatar size="100px" class="q-mb-sm">
              <img :src="userAvatar">
            </q-avatar>
            <div class="text-h5 text-weight-bold">{{ userNome }}</div>
            <div class="text-subtitle2 text-grey-7">{{ userEmail }}</div>
          </div>

          <!-- Estatísticas -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5 text-primary">{{ estatisticas.pedidos }}</div>
                  <div class="text-caption">Pedidos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5 text-secondary">{{ estatisticas.sessoes }}</div>
                  <div class="text-caption">Sessões</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5 text-accent">{{ estatisticas.conteudos }}</div>
                  <div class="text-caption">Conteúdos</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Menu -->
          <q-list bordered separator>
            <q-item clickable v-ripple @click="editarPerfil">
              <q-item-section avatar>
                <q-icon name="edit" color="primary" />
              </q-item-section>
              <q-item-section>Editar Perfil</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="verMetodosPagamento">
              <q-item-section avatar>
                <q-icon name="credit_card" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Métodos de Pagamento</q-item-label>
                <q-item-label caption>M-Pesa, mKESh, E-Mola</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="configuracoes">
              <q-item-section avatar>
                <q-icon name="settings" color="dark" />
              </q-item-section>
              <q-item-section>Configurações</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="ajuda">
              <q-item-section avatar>
                <q-icon name="help" color="info" />
              </q-item-section>
              <q-item-section>Ajuda e Suporte</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="logout">
              <q-item-section avatar>
                <q-icon name="exit_to_app" color="negative" />
              </q-item-section>
              <q-item-section class="text-negative">Sair</q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </template>
    </q-page-container>

    <!-- Diálogo Novo Pedido -->
    <q-dialog v-model="novoPedidoDialog" persistent maximized>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row items-center justify-between">
            <div class="text-h6">Novo Pedido de Ajuda</div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="scroll q-pa-md">
          <q-select
            v-model="novoPedido.materia"
            :options="materias"
            label="Matéria *"
            outlined
            class="q-mb-md"
            behavior="menu"
          />
          <q-input
            v-model="novoPedido.titulo"
            label="Título *"
            outlined
            class="q-mb-md"
            maxlength="100"
            counter
          />
          <q-input
            v-model="novoPedido.descricao"
            label="Descrição *"
            type="textarea"
            outlined
            rows="4"
            class="q-mb-md"
            maxlength="500"
            counter
          />
          <q-select
            v-model="novoPedido.tipo_servico"
            :options="tiposServico"
            label="Tipo de serviço *"
            outlined
            class="q-mb-md"
            behavior="menu"
          />
          <q-select
            v-model="novoPedido.nivel"
            :options="niveis"
            label="Nível *"
            outlined
            class="q-mb-md"
            behavior="menu"
          />
          <q-select
            v-model="novoPedido.duracao"
            :options="duracoes"
            label="Duração *"
            outlined
            class="q-mb-md"
            behavior="menu"
          />
          <q-select
            v-model="novoPedido.prazo"
            :options="prazos"
            label="Prazo *"
            outlined
            class="q-mb-md"
            behavior="menu"
          />
          <q-input
            v-model="novoPedido.preco"
            label="Valor (MZN) *"
            type="number"
            outlined
            class="q-mb-md"
            :min="50"
          />
          <q-select
            v-model="novoPedido.local"
            :options="locais"
            label="Local *"
            outlined
            class="q-mb-md"
            behavior="menu"
          />
          <q-checkbox v-model="novoPedido.urgente" label="É urgente?" class="q-mb-md" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn color="primary" label="Publicar" @click="criarPedido" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Detalhes do Pedido -->
    <q-dialog v-model="detalhesPedidoDialog" maximized>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row items-center justify-between">
            <div class="text-h6">Detalhes do Pedido</div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="scroll" v-if="pedidoSelecionado">
          <div class="text-h6">{{ pedidoSelecionado.titulo }}</div>
          <div class="text-caption text-grey-7 q-mb-md">Criado em {{ formatarData(pedidoSelecionado.created_at) }}</div>

          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">Descrição</div>
              <div class="text-body2">{{ pedidoSelecionado.descricao }}</div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">Detalhes</div>
              <div class="row">
                <div class="col-6">Matéria: {{ pedidoSelecionado.materia }}</div>
                <div class="col-6">Nível: {{ pedidoSelecionado.nivel }}</div>
                <div class="col-6">Tipo: {{ pedidoSelecionado.tipo_servico }}</div>
                <div class="col-6">Duração: {{ pedidoSelecionado.duracao }}</div>
                <div class="col-6">Prazo: {{ pedidoSelecionado.prazo }}</div>
                <div class="col-6">Local: {{ pedidoSelecionado.local }}</div>
                <div class="col-12 text-primary text-weight-bold q-mt-md">
                  Valor: {{ formatarPreco(pedidoSelecionado.preco) }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered v-if="pedidoSelecionado.propostas?.length > 0">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">Propostas ({{ pedidoSelecionado.propostas.length }})</div>
              <div v-for="prop in pedidoSelecionado.propostas" :key="prop.id" class="q-mb-sm">
                <div class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders">
                  <div class="row items-center">
                    <q-avatar size="32px" class="q-mr-xs">
                      <img :src="prop.explicador?.avatar || 'https://cdn.quasar.dev/img/avatar3.jpg'">
                    </q-avatar>
                    <div>
                      <div class="text-caption text-weight-bold">{{ prop.explicador?.nome }}</div>
                      <div class="text-caption text-grey-7">{{ formatarPreco(prop.valor) }}</div>
                    </div>
                  </div>
                  <q-btn flat round color="positive" icon="check" size="sm" @click="aceitarProposta(prop.id)" />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import Api from 'src/services/api.js'

export default {
  name: 'EstudantePage',

  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const loading = ref(true)
    const tab = ref('pedidos')
    
    // Dados do usuário
    const user = ref(Api.AuthService.getUser() || {})
    const userNome = computed(() => user.value?.nome || 'Estudante')
    const userEmail = computed(() => user.value?.email || '')
    const userAvatar = computed(() => user.value?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg')
    const userInfo = ref(null)
    const saldo = ref(1250)
    const notificacoesNaoLidas = ref(3)

    // Estatísticas
    const estatisticas = ref({
      pedidos: 0,
      sessoes: 0,
      conteudos: 0
    })

    // Pedidos
    const filtroPedidos = ref('todos')
    const pedidos = ref([])
    const pedidosAtivos = computed(() => pedidos.value.filter(p => p.status !== 'Concluído').length)
    const pedidosFiltrados = computed(() => {
      if (filtroPedidos.value === 'todos') return pedidos.value
      if (filtroPedidos.value === 'ativos') return pedidos.value.filter(p => p.status !== 'Concluído')
      return pedidos.value.filter(p => p.status === 'Concluído')
    })

    // Biblioteca
    const biblioteca = ref([])
    const bibliotecaCount = computed(() => biblioteca.value.length)

    // Loja
    const buscaConteudos = ref('')
    const filtroMateria = ref('todos')
    const conteudos = ref([])
    const conteudosFiltrados = computed(() => {
      let result = conteudos.value
      if (buscaConteudos.value) {
        result = result.filter(c => 
          c.titulo?.toLowerCase().includes(buscaConteudos.value.toLowerCase())
        )
      }
      if (filtroMateria.value !== 'todos') {
        result = result.filter(c => c.materia === filtroMateria.value)
      }
      return result
    })

    // Diálogos
    const novoPedidoDialog = ref(false)
    const detalhesPedidoDialog = ref(false)
    const pedidoSelecionado = ref(null)

    // Formulário novo pedido
    const novoPedido = reactive({
      materia: '',
      titulo: '',
      descricao: '',
      tipo_servico: '',
      nivel: '',
      duracao: '',
      prazo: '',
      preco: 200,
      local: '',
      urgente: false
    })

    // Opções para selects
    const materias = ['Matemática', 'Física', 'Química', 'Português', 'História', 'Geografia', 'Biologia', 'Inglês']
    const tiposServico = ['Sessão ao vivo', 'Resolução de exercícios', 'Revisão de trabalho', 'Preparação para teste']
    const niveis = ['8ª Classe', '9ª Classe', '10ª Classe', '11ª Classe', '12ª Classe', 'Ensino Superior']
    const duracoes = ['30 min', '45 min', '60 min', '90 min', '120 min']
    const prazos = ['Hoje', 'Amanhã', 'Esta semana', 'Sem urgência']
    const locais = ['Online', 'Presencial - Maputo', 'Presencial - Matola', 'Presencial - Outro']

    // ===== CARREGAR DADOS =====
    const carregarDados = async () => {
      loading.value = true
      try {
        await Promise.all([
          carregarPedidos(),
          carregarBiblioteca(),
          carregarConteudos(),
          carregarPerfil()
        ])
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: Api.handleError(error)
        })
      } finally {
        loading.value = false
      }
    }

    const carregarPedidos = async () => {
      try {
        const data = await Api.EstudanteService.getPedidos()
        pedidos.value = data.pedidos || []
        console.log(data)
        estatisticas.value.pedidos = data.stats?.total || pedidos.value.length
        estatisticas.value.sessoes = data.stats?.concluidos || 0
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error)
        pedidos.value = []
      }
    }

    const carregarBiblioteca = async () => {
      try {
        const data = await Api.EstudanteService.getBiblioteca()
        biblioteca.value = data.itens || []
        estatisticas.value.conteudos = biblioteca.value.length
      } catch (error) {
        console.error('Erro ao carregar biblioteca:', error)
        biblioteca.value = []
      }
    }

    const carregarConteudos = async () => {
      try {
        const data = await Api.EstudanteService.getConteudos()
        conteudos.value = data.conteudos?.data || []
      } catch (error) {
        console.error('Erro ao carregar conteúdos:', error)
        conteudos.value = []
      }
    }

    const carregarPerfil = async () => {
      try {
        const data = await Api.AuthService.getCurrentUser()
        user.value = data
        userInfo.value = data.estudante
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
      }
    }

    // ===== PEDIDOS =====
    const criarPedido = async () => {
      try {
        await Api.EstudanteService.criarPedido(novoPedido)
        $q.notify({
          type: 'positive',
          message: 'Pedido criado com sucesso!'
        })
        novoPedidoDialog.value = false
        await carregarPedidos()
        
        // Reset form
        Object.assign(novoPedido, {
          materia: '', titulo: '', descricao: '', tipo_servico: '',
          nivel: '', duracao: '', prazo: '', preco: 200, local: '', urgente: false
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: Api.handleError(error)
        })
      }
    }

    const aceitarProposta = async (propostaId) => {
      try {
        await Api.EstudanteService.aceitarProposta(propostaId)
        $q.notify({
          type: 'positive',
          message: 'Proposta aceita com sucesso!'
        })
        await carregarPedidos()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: Api.handleError(error)
        })
      }
    }

    const avaliarPedido = async (pedido) => {
      if (!pedido.avaliacaoTemp) return
      
      try {
        await Api.EstudanteService.avaliarSessao(pedido.id, { nota: pedido.avaliacaoTemp })
        $q.notify({
          type: 'positive',
          message: 'Avaliação enviada! Obrigado.'
        })
        pedido.avaliado = true
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: Api.handleError(error)
        })
      }
    }

    const verDetalhesPedido = (pedido) => {
      pedidoSelecionado.value = pedido
      detalhesPedidoDialog.value = true
    }

    // ===== BIBLIOTECA =====
    const toggleFavorito = async (item) => {
      try {
        await Api.EstudanteService.toggleFavorito(item.id)
        item.favorito = !item.favorito
        $q.notify({
          type: item.favorito ? 'positive' : 'info',
          message: item.favorito ? 'Adicionado aos favoritos' : 'Removido dos favoritos'
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: Api.handleError(error)
        })
      }
    }

    // ===== LOJA =====
    const comprarConteudo = async (conteudo) => {
      try {
        await Api.EstudanteService.comprarConteudo(conteudo.id)
        $q.notify({
          type: 'positive',
          message: 'Conteúdo adquirido com sucesso!'
        })
        await carregarBiblioteca()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: Api.handleError(error)
        })
      }
    }

    const verDetalhesConteudo = (conteudo) => {
      $q.dialog({
        title: conteudo.titulo,
        message: `
          <b>Autor:</b> ${conteudo.explicador?.nome}<br>
          <b>Matéria:</b> ${conteudo.materia}<br>
          <b>Preço:</b> ${Api.formatarPreco(conteudo.preco)}<br><br>
          ${conteudo.descricao || 'Sem descrição'}
        `,
        html: true,
        persistent: true
      })
    }

    // ===== PERFIL =====
    const editarPerfil = () => {
      $q.dialog({
        title: 'Editar Perfil',
        prompt: {
          model: user.value.nome,
          label: 'Nome completo'
        },
        cancel: true,
        persistent: true
      }).onOk(async (nome) => {
        try {
          await Api.AuthService.updateProfile({ nome })
          user.value.nome = nome
          $q.notify({
            type: 'positive',
            message: 'Perfil atualizado!'
          })
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: Api.handleError(error)
          })
        }
      })
    }

    const verMetodosPagamento = () => {
      $q.dialog({
        title: 'Métodos de Pagamento',
        message: `
          <b>M-Pesa:</b> 84 123 4567<br>
          <b>mKESh:</b> 86 123 4567<br>
          <b>E-Mola:</b> 82 123 4567
        `,
        html: true,
        persistent: true
      })
    }

    const configuracoes = () => {
      $q.dialog({
        title: 'Configurações',
        message: 'Função em desenvolvimento',
        persistent: true
      })
    }

    const ajuda = () => {
      $q.dialog({
        title: 'Ajuda e Suporte',
        message: 'suporte@edulink.co.mz',
        persistent: true
      })
    }

    const logout = async () => {
      try {
        await Api.AuthService.logout()
        router.push('/login')
      } catch (error) {
        router.push('/login')
      }
    }

    const abrirChat = (explicador) => {
      $q.notify({
        type: 'info',
        message: `Abrindo chat com ${explicador?.nome || 'explicador'}`
      })
    }

    // ===== UTILITÁRIOS =====
    const formatarData = (data) => {
      if (!data) return 'Data desconhecida'
      return new Date(data).toLocaleDateString('pt-MZ')
    }

    const getCorMateria = (materia) => {
      const cores = {
        'Matemática': 'primary',
        'Física': 'secondary',
        'Química': 'accent',
        'Português': 'positive',
        'História': 'warning',
        'Geografia': 'info',
        'Biologia': 'purple',
        'Inglês': 'orange'
      }
      return cores[materia] || 'grey-7'
    }

    const getIconeMateria = (materia) => {
      const icons = {
        'Matemática': 'functions',
        'Física': 'science',
        'Química': 'biotech',
        'Português': 'translate',
        'História': 'history',
        'Geografia': 'public',
        'Biologia': 'pets',
        'Inglês': 'language'
      }
      return icons[materia] || 'school'
    }

    const getStatusCor = (status) => {
      const cores = {
        'Aguardando': 'info',
        'Em negociação': 'warning',
        'Aceito': 'positive',
        'Em andamento': 'accent',
        'Concluído': 'grey-7',
        'Cancelado': 'negative'
      }
      return cores[status] || 'grey'
    }

    onMounted(() => {
      carregarDados()
    })

    return {
      // Estado
      loading,
      tab,
      user,
      userNome,
      userEmail,
      userAvatar,
      userInfo,
      saldo,
      notificacoesNaoLidas,
      estatisticas,
      
      // Pedidos
      filtroPedidos,
      pedidos,
      pedidosAtivos,
      pedidosFiltrados,
      
      // Biblioteca
      biblioteca,
      bibliotecaCount,
      
      // Loja
      buscaConteudos,
      filtroMateria,
      conteudos,
      conteudosFiltrados,
      
      // Diálogos
      novoPedidoDialog,
      detalhesPedidoDialog,
      pedidoSelecionado,
      novoPedido,
      
      // Opções
      materias,
      tiposServico,
      niveis,
      duracoes,
      prazos,
      locais,
      
      // Métodos
      carregarDados,
      criarPedido,
      aceitarProposta,
      avaliarPedido,
      verDetalhesPedido,
      toggleFavorito,
      comprarConteudo,
      verDetalhesConteudo,
      editarPerfil,
      verMetodosPagamento,
      configuracoes,
      ajuda,
      logout,
      abrirChat,
      
      // Utilitários
      formatarData: Api.formatarData || formatarData,
      formatarPreco: Api.formatarPreco,
      getCorMateria,
      getIconeMateria,
      getStatusCor
    }
  }
}
</script>

<style scoped>
.pedido-card {
  border-radius: 12px;
  transition: all 0.2s ease;
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.bg-positive-light {
  background-color: #E8F5E9;
}

.biblioteca-card, .conteudo-card {
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.biblioteca-card:hover, .conteudo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.lines-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 32px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
</style>