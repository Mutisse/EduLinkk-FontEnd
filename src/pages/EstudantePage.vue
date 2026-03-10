<template>
  <q-layout view="hHh LpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white" style="background: linear-gradient(135deg, #667eea, #764ba2) !important">
      <q-toolbar>
        <q-avatar @click="abrirMenuPerfil" class="cursor-pointer">
          <img
            :src="userAvatar"
            @error="$event.target.src = configs.urls?.avatar_aluno_padrao || 'https://cdn.quasar.dev/img/avatar2.jpg'"
          >
        </q-avatar>
        <q-toolbar-title @click="abrirMenuPerfil" class="cursor-pointer">
          {{ userNome }}
          <template v-if="userInfo">
            <div class="text-caption">{{ userInfo.nivel || 'Estudante' }}</div>
          </template>
        </q-toolbar-title>

        <!-- Saldo -->
        <q-chip
          dense
          class="bg-white text-primary q-mr-sm cursor-pointer"
          style="color: #667eea !important"
          @click="verExtrato"
        >
          <q-avatar icon="account_balance_wallet" color="primary" text-color="white" style="background: linear-gradient(135deg, #667eea, #764ba2)" />
          {{ formatarPreco(saldo) }}
        </q-chip>

        <q-btn flat round dense icon="notifications" @click="abrirNotificacoes">
          <q-badge color="red" floating>{{ notificacoesNaoLidas }}</q-badge>
        </q-btn>
      </q-toolbar>

      <!-- Menu do Perfil (dropdown) -->
      <q-menu v-model="menuPerfilAberto" anchor="bottom left" self="top left" :offset="[10, 10]">
        <q-list style="min-width: 200px">
          <q-item clickable v-close-popup @click="irParaPerfil">
            <q-item-section avatar>
              <q-avatar size="32px">
                <img :src="userAvatar">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ userNome }}</q-item-label>
              <q-item-label caption>{{ userEmail }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-close-popup @click="editarPerfil">
            <q-item-section avatar>
              <q-icon name="edit" style="color: #667eea" />
            </q-item-section>
            <q-item-section>Editar Perfil</q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="configuracoes">
            <q-item-section avatar>
              <q-icon name="settings" color="dark" />
            </q-item-section>
            <q-item-section>Configurações</q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable v-close-popup @click="logout">
            <q-item-section avatar>
              <q-icon name="exit_to_app" color="negative" />
            </q-item-section>
            <q-item-section class="text-negative">Sair</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-header>

    <!-- Navegação Inferior -->
    <q-footer class="bg-white text-dark">
      <q-tabs v-model="tab" dense class="text-grey-7" active-color="primary" indicator-color="primary" align="justify" style="--q-primary: #667eea">
        <q-tab name="pedidos" icon="list" :label="configs.textos?.abas?.pedidos || 'Pedidos'">
          <q-badge v-if="pedidosAtivos > 0" color="red" floating>{{ pedidosAtivos }}</q-badge>
        </q-tab>
        <q-tab name="biblioteca" icon="menu_book" :label="configs.textos?.abas?.biblioteca || 'Biblioteca'">
          <q-badge v-if="bibliotecaCount > 0" color="primary" floating>{{ bibliotecaCount }}</q-badge>
        </q-tab>
        <q-tab name="loja" icon="store" :label="configs.textos?.abas?.loja || 'Loja'" />
        <q-tab name="perfil" icon="person" :label="configs.textos?.abas?.perfil || 'Perfil'" />
      </q-tabs>
    </q-footer>

    <!-- Conteúdo Principal -->
    <q-page-container>
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <q-spinner color="primary" size="3em" style="color: #667eea !important" />
        <p class="q-mt-md">{{ configs.textos?.carregando || 'Carregando...' }}</p>
      </div>

      <!-- Conteúdo -->
      <template v-else>
        <!-- ==================== PEDIDOS ==================== -->
        <q-page v-if="tab === 'pedidos'" class="q-pa-md">

          <!-- ===== BANNER INTELIGENTE ===== -->
          <div class="row q-mb-xl">
            <div class="col-12">
              <!-- Banner de Promoção (se houver) -->
              <template v-if="promocoesAtivas && promocoesAtivas.length > 0">
                <q-card flat class="banner-promocional" @click="verPromocao(promocoesAtivas[0])">
                  <q-img
                    :src="promocoesAtivas[0].imagem || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80'"
                    class="banner-imagem"
                    style="height: 200px; border-radius: 24px;"
                  >
                    <div class="banner-overlay"></div>
                    <div class="banner-conteudo absolute-bottom">
                      <div class="banner-tag" :style="{background: 'linear-gradient(135deg, #667eea, #764ba2)'}">
                        {{ promocoesAtivas[0].tag || 'PROMOÇÃO' }}
                      </div>
                      <h4 class="banner-titulo">{{ promocoesAtivas[0].titulo }}</h4>
                      <p class="banner-descricao">{{ promocoesAtivas[0].descricao }}</p>
                      <div class="banner-acoes">
                        <span class="banner-valor">{{ promocoesAtivas[0].valor }}</span>
                        <q-btn
                          flat
                          dense
                          label="Aproveitar"
                          class="banner-btn"
                          style="color: white; border: 1px solid white;"
                          @click.stop="usarPromocao(promocoesAtivas[0])"
                        />
                      </div>
                    </div>
                  </q-img>
                </q-card>
              </template>

              <!-- Banner Informativo (se não houver promoções) -->
              <template v-else>
                <q-card flat class="banner-informativo" style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 24px; overflow: hidden;">
                  <div class="row items-center">
                    <div class="col-12 col-md-7 q-pa-lg">
                      <div class="banner-info">
                        <div class="banner-info-icon">
                          <span class="material-icons" style="font-size: 48px; color: rgba(255,255,255,0.3);">auto_stories</span>
                        </div>
                        <h3 class="banner-info-titulo text-white">Olá, {{ userNome }}! 👋</h3>
                        <p class="banner-info-texto text-white" style="opacity: 0.9; font-size: 16px; line-height: 1.6;">
                          {{ mensagemInformativa }}
                        </p>

                        <div class="banner-info-stats row q-col-gutter-md q-mt-md">
                          <div class="col-4">
                            <div class="stat-card">
                              <span class="stat-number text-white">{{ estatisticas.pedidos || 0 }}</span>
                              <span class="stat-label text-white">Pedidos</span>
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="stat-card">
                              <span class="stat-number text-white">{{ estatisticas.sessoes || 0 }}</span>
                              <span class="stat-label text-white">Sessões</span>
                            </div>
                          </div>
                          <div class="col-4">
                            <div class="stat-card">
                              <span class="stat-number text-white">{{ bibliotecaCount || 0 }}</span>
                              <span class="stat-label text-white">Conteúdos</span>
                            </div>
                          </div>
                        </div>

                        <div class="banner-info-dicas q-mt-md">
                          <div class="dica-item">
                            <span class="material-icons text-white" style="font-size: 20px;">lightbulb</span>
                            <span class="text-white">Dica: {{ dicaDoDia }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="col-12 col-md-5">
                      <div class="banner-ilustracao">
                        <img
                          src="https://cdni.iconscout.com/illustration/premium/thumb/student-studying-4928806-4119645.png"
                          alt="Estudante"
                          style="width: 100%; max-height: 250px; object-fit: contain;"
                        >
                      </div>
                    </div>
                  </div>
                </q-card>
              </template>
            </div>
          </div>

          <!-- ===== BOTÃO CRIAR PEDIDO ===== -->
          <div class="row q-mb-md">
            <q-btn
              color="primary"
              label="Criar Pedido de Ajuda"
              icon="add_circle"
              class="full-width"
              style="background: linear-gradient(135deg, #667eea, #764ba2); height: 56px; font-size: 16px; font-weight: 600; border-radius: 16px;"
              @click="novoPedidoDialog = true"
            />
          </div>

          <!-- ===== PROPOSTAS DE EXPLICADORES ===== -->
          <div class="row q-mb-lg">
            <div class="col-12">
              <div class="text-h6 q-mb-md" style="color: #667eea; font-weight: 600; display: flex; align-items: center;">
                <span class="material-icons q-mr-sm">chat</span>
                Propostas para você
                <q-badge v-if="totalPropostasPendentes > 0" color="red" class="q-ml-sm">{{ totalPropostasPendentes }}</q-badge>
              </div>
            </div>

            <div class="col-12">
              <template v-if="propostasDestaque && propostasDestaque.length > 0">
                <div class="row q-col-gutter-md">
                  <div v-for="prop in propostasDestaque" :key="prop.id" class="col-12">
                    <q-card flat bordered class="proposta-card">
                      <q-card-section>
                        <div class="row items-center">
                          <q-avatar size="48px" class="q-mr-md">
                            <img :src="prop.explicador?.avatar || configs.urls?.avatar_explicador_padrao">
                          </q-avatar>

                          <div class="col">
                            <div class="row items-center">
                              <span class="text-weight-bold">{{ prop.explicador?.nome || 'Explicador' }}</span>
                              <q-rating
                                :value="prop.explicador?.avaliacao || 0"
                                size="16px"
                                :max="5"
                                color="accent"
                                readonly
                                class="q-ml-xs"
                              />
                            </div>
                            <div class="text-caption text-grey-7">
                              {{ prop.explicador?.materias?.join(' • ') || 'Matérias' }}
                            </div>
                          </div>
                        </div>

                        <div class="q-mt-md">
                          <div class="text-subtitle2">{{ prop.pedido?.titulo || 'Proposta para seu pedido' }}</div>
                          <div class="text-caption text-grey-7">
                            {{ prop.pedido?.descricao || 'Descrição do pedido...' }}
                          </div>
                        </div>

                        <div class="row items-center justify-between q-mt-md">
                          <div>
                            <span class="text-weight-bold text-h6" style="color: #667eea">
                              {{ formatarPreco(prop.valor) }}
                            </span>
                            <span class="text-caption text-grey-7 q-ml-xs">/sessão</span>
                          </div>

                          <div class="row items-center">
                            <q-btn
                              flat
                              round
                              color="positive"
                              icon="check"
                              size="sm"
                              @click="aceitarProposta(prop.id)"
                            >
                              <q-tooltip>Aceitar proposta</q-tooltip>
                            </q-btn>
                            <q-btn
                              flat
                              round
                              color="negative"
                              icon="close"
                              size="sm"
                              @click="recusarProposta(prop.id)"
                            >
                              <q-tooltip>Recusar</q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </template>

              <template v-else>
                <q-card flat bordered class="text-center q-py-xl">
                  <q-card-section>
                    <q-icon name="inbox" size="48px" color="grey-4" />
                    <div class="text-h6 text-grey-7 q-mt-md">Nenhuma proposta no momento</div>
                    <div class="text-caption text-grey-6">
                      Quando explicadores enviarem propostas para seus pedidos, elas aparecerão aqui
                    </div>
                  </q-card-section>
                </q-card>
              </template>
            </div>
          </div>

          <!-- ===== CONTEÚDOS RELACIONADOS ===== -->
          <div class="row q-mb-lg">
            <div class="col-12">
              <div class="text-h6 q-mb-md" style="color: #667eea; font-weight: 600; display: flex; align-items: center;">
                <span class="material-icons q-mr-sm">menu_book</span>
                Recomendados para você
              </div>
            </div>

            <div class="col-12">
              <template v-if="conteudosRelacionados && conteudosRelacionados.length > 0">
                <div class="row q-col-gutter-md">
                  <div v-for="item in conteudosRelacionados" :key="item.id" class="col-6 col-md-3">
                    <q-card flat bordered class="conteudo-card" @click="verDetalhesConteudo(item)">
                      <q-img
                        :src="item.capa || configs.urls?.capa_padrao"
                        ratio="1"
                        style="border-radius: 12px 12px 0 0"
                      >
                        <div class="absolute-top-left q-pa-xs">
                          <q-badge style="background: linear-gradient(135deg, #667eea, #764ba2)">
                            {{ obterNomeMateria(item.materia_id) }}
                          </q-badge>
                        </div>
                      </q-img>

                      <q-card-section class="q-pa-sm">
                        <div class="text-caption text-weight-bold lines-2">{{ item.titulo }}</div>

                        <div class="row items-center q-mt-xs">
                          <q-avatar size="16px" class="q-mr-xs">
                            <img :src="item.explicador?.avatar || configs.urls?.avatar_explicador_padrao">
                          </q-avatar>
                          <span class="text-caption text-grey-7">{{ item.explicador?.nome || 'Explicador' }}</span>
                        </div>

                        <div class="row items-center justify-between q-mt-xs">
                          <span class="text-weight-bold" style="color: #667eea">
                            {{ formatarPreco(item.preco) }}
                          </span>
                          <q-rating
                            :value="item.avaliacao || 0"
                            size="12px"
                            :max="5"
                            color="accent"
                            readonly
                          />
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </template>

              <template v-else>
                <q-card flat bordered class="text-center q-py-xl">
                  <q-card-section>
                    <q-icon name="menu_book" size="48px" color="grey-4" />
                    <div class="text-h6 text-grey-7 q-mt-md">Nenhum conteúdo disponível</div>
                    <div class="text-caption text-grey-6">
                      Explore a loja para encontrar conteúdos interessantes
                    </div>
                    <q-btn
                      flat
                      label="Ir para Loja"
                      style="color: #667eea"
                      class="q-mt-md"
                      @click="tab = 'loja'"
                    />
                  </q-card-section>
                </q-card>
              </template>
            </div>
          </div>

          <!-- Filtros -->
          <div class="row q-mb-md">
            <q-btn-toggle
              v-model="filtroPedidos"
              toggle-color="primary"
              :options="filtrosPedidosOpcoes"
              spread
              unelevated
              dense
              style="--q-primary: #667eea"
            />
          </div>

          <!-- Lista de Pedidos -->
          <div class="row q-col-gutter-md">
            <div v-if="pedidosFiltrados.length === 0" class="col-12 text-center q-py-xl">
              <q-icon name="inbox" size="64px" color="grey-3" />
              <div class="text-h6 text-grey-7 q-mt-md">{{ configs.mensagens?.vazio?.pedidos || 'Nenhum pedido encontrado' }}</div>
              <q-btn
                color="primary"
                :label="configs.textos?.botoes?.criarPrimeiroPedido || 'Criar primeiro pedido'"
                class="q-mt-md"
                style="background: linear-gradient(135deg, #667eea, #764ba2)"
                @click="novoPedidoDialog = true"
              />
            </div>

            <div v-for="pedido in pedidosFiltrados" :key="pedido.id" class="col-12">
              <q-card flat bordered class="pedido-card">
                <q-card-section>
                  <!-- Cabeçalho -->
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar style="background: linear-gradient(135deg, #667eea, #764ba2)" text-color="white" size="36px" class="q-mr-sm">
                        <q-icon :name="configs.icones?.materia_padrao || 'school'" size="20px" />
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
                    <div class="text-caption text-weight-bold q-mb-xs">
                      {{ configs.textos?.propostas?.replace('{quantidade}', pedido.propostas.length) || `📩 ${pedido.propostas.length} proposta(s):` }}
                    </div>
                    <div v-for="prop in pedido.propostas" :key="prop.id" class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders q-mb-xs">
                      <div class="row items-center">
                        <q-avatar size="28px" class="q-mr-xs">
                          <img
                            :src="prop.explicador?.avatar || configs.urls?.avatar_explicador_padrao || 'https://cdn.quasar.dev/img/avatar3.jpg'"
                            @error="$event.target.src = configs.urls?.avatar_explicador_padrao || 'https://cdn.quasar.dev/img/avatar3.jpg'"
                          >
                        </q-avatar>
                        <div>
                          <div class="row items-center">
                            <span class="text-caption text-weight-bold">{{ prop.explicador?.nome || 'Explicador' }}</span>
                          </div>
                          <div class="text-caption text-grey-7">{{ prop.explicador?.materias?.join(', ') || 'Matéria' }}</div>
                        </div>
                      </div>
                      <div class="row items-center">
                        <div class="text-primary text-weight-bold q-mr-md" style="color: #667eea">{{ formatarPreco(prop.valor) }}</div>
                        <q-btn
                          flat round color="positive" icon="check" size="sm"
                          @click="aceitarProposta(prop.id)"
                          :title="configs.textos?.botoes?.aceitarProposta || 'Aceitar proposta'"
                        >
                          <q-tooltip>{{ configs.textos?.botoes?.aceitarProposta || 'Aceitar proposta' }}</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </div>

                  <!-- Explicador Aceito -->
                  <div v-if="pedido.explicador && pedido.status === 'Aceito'" class="q-mt-md bg-positive-light q-pa-sm rounded-borders">
                    <div class="row items-center justify-between">
                      <div class="row items-center">
                        <q-avatar size="32px" class="q-mr-sm">
                          <img
                            :src="pedido.explicador.avatar || configs.urls?.avatar_explicador_padrao || 'https://cdn.quasar.dev/img/avatar3.jpg'"
                            @error="$event.target.src = configs.urls?.avatar_explicador_padrao || 'https://cdn.quasar.dev/img/avatar3.jpg'"
                          >
                        </q-avatar>
                        <div>
                          <div class="row items-center">
                            <span class="text-caption text-weight-bold">{{ pedido.explicador.nome }}</span>
                            <q-rating :value="pedido.explicador.avaliacao || 0" size="14px" :max="5" color="accent" readonly class="q-ml-xs" />
                          </div>
                          <div class="text-caption text-grey-7">{{ pedido.explicador.materias?.join(', ') || pedido.materia }}</div>
                        </div>
                      </div>
                      <div class="text-primary text-weight-bold" style="color: #667eea">{{ formatarPreco(pedido.preco_combinado || pedido.preco) }}</div>
                    </div>
                    <div class="row q-mt-md q-col-gutter-sm">
                      <div class="col-6">
                        <q-btn
                          flat :label="configs.textos?.botoes?.chat || 'Chat'"
                          style="color: #667eea" icon="chat" class="full-width"
                          @click="abrirChat(pedido.explicador)"
                        />
                      </div>
                      <div class="col-6">
                        <q-btn
                          flat :label="configs.textos?.botoes?.detalhes || 'Detalhes'"
                          color="secondary" icon="info" class="full-width"
                          @click="verDetalhesPedido(pedido)"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Avaliação -->
                  <div v-if="pedido.status === 'Concluído' && !pedido.avaliado" class="q-mt-md">
                    <div class="text-caption q-mb-xs">{{ configs.textos?.avaliacao || 'Avalie sua experiência:' }}</div>
                    <div class="row items-center justify-between">
                      <q-rating v-model="pedido.avaliacaoTemp" size="1.5em" :max="5" color="accent" />
                      <q-btn
                        flat :label="configs.textos?.botoes?.enviar || 'Enviar'"
                        style="color: #667eea" size="sm"
                        @click="avaliarPedido(pedido)"
                        :disable="!pedido.avaliacaoTemp"
                      />
                    </div>
                  </div>

                  <!-- Rodapé -->
                  <div class="row items-center justify-between q-mt-md">
                    <div class="row items-center">
                      <q-icon name="visibility" size="16px" class="text-grey-7 q-mr-xs" />
                      <span class="text-caption text-grey-7">{{ pedido.visualizacoes || 0 }} {{ configs.textos?.visualizacoes || 'visualizações' }}</span>
                    </div>
                    <q-btn
                      flat :label="configs.textos?.botoes?.verDetalhes || 'Ver detalhes'"
                      style="color: #667eea" size="sm"
                      @click="verDetalhesPedido(pedido)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- ==================== BIBLIOTECA ==================== -->
        <q-page v-if="tab === 'biblioteca'" class="q-pa-md">
          <div class="row q-mb-md">
            <div class="col-12">
              <div class="text-h6" style="color: #667eea">{{ configs.titulos?.biblioteca || 'Minha Biblioteca' }}</div>
              <div class="text-caption text-grey-7">{{ biblioteca.length }} {{ configs.textos?.itens || 'itens' }}</div>
            </div>
          </div>

          <!-- Filtros da Biblioteca -->
          <div class="row q-mb-md" v-if="biblioteca.length > 0">
            <q-btn-toggle
              v-model="filtroBiblioteca"
              toggle-color="primary"
              :options="filtrosBibliotecaOpcoes"
              spread
              unelevated
              dense
              style="--q-primary: #667eea"
            />
          </div>

          <div class="row q-col-gutter-md">
            <div v-if="bibliotecaFiltrada.length === 0" class="col-12 text-center q-py-xl">
              <q-icon name="menu_book" size="64px" color="grey-3" />
              <div class="text-h6 text-grey-7 q-mt-md">{{ configs.mensagens?.vazio?.biblioteca || 'Sua biblioteca está vazia' }}</div>
              <q-btn
                color="primary"
                :label="configs.textos?.botoes?.explorarConteudos || 'Explorar conteúdos'"
                class="q-mt-md"
                style="background: linear-gradient(135deg, #667eea, #764ba2)"
                @click="tab = 'loja'"
              />
            </div>

            <div v-for="item in bibliotecaFiltrada" :key="item.id" class="col-6 col-md-3">
              <q-card flat bordered class="biblioteca-card" @click="abrirItemBiblioteca(item)">
                <q-img
                  :src="item.conteudo?.capa || configs.urls?.capa_padrao || 'https://cdn.quasar.dev/img/mountains.jpg'"
                  ratio="1"
                  @error="$event.target.src = configs.urls?.capa_padrao || 'https://cdn.quasar.dev/img/mountains.jpg'"
                >
                  <div class="absolute-top-right q-pa-xs">
                    <q-btn
                      flat round dense
                      :color="item.favorito ? 'red' : 'white'"
                      :icon="item.favorito ? 'favorite' : 'favorite_border'"
                      size="sm"
                      @click.stop="toggleFavorito(item)"
                    />
                  </div>
                  <div class="absolute-bottom">
                    <div class="text-caption text-weight-bold">{{ item.conteudo?.titulo || 'Conteúdo' }}</div>
                  </div>
                </q-img>
                <q-card-section class="q-pa-xs">
                  <div class="row items-center justify-between">
                    <span class="text-caption text-grey-7">{{ item.conteudo?.explicador?.nome || 'Explicador' }}</span>
                    <q-linear-progress :value="item.progresso / 100" color="primary" size="4px" style="width: 50px; --q-primary: #667eea" rounded />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- ==================== LOJA ==================== -->
        <q-page v-if="tab === 'loja'" class="q-pa-md">
          <div class="row q-mb-md">
            <div class="col-12">
              <div class="text-h6" style="color: #667eea">{{ configs.titulos?.loja || 'Loja de Conteúdos' }}</div>
              <div class="text-caption text-grey-7">{{ configs.subtitulos?.loja || 'Aprenda com os melhores' }}</div>
            </div>
          </div>

          <!-- Filtros -->
          <div class="row q-mb-md">
            <q-input
              v-model="buscaConteudos"
              outlined dense
              :placeholder="configs.textos?.busca || 'Buscar...'"
              class="col-12 col-md-6"
              debounce="300"
            >
              <template v-slot:prepend>
                <q-icon name="search" style="color: #667eea" />
              </template>
              <template v-slot:append>
                <q-icon v-if="buscaConteudos" name="close" class="cursor-pointer" @click="buscaConteudos = ''" style="color: #667eea" />
              </template>
            </q-input>
          </div>

          <div class="row q-mb-md">
            <q-btn-toggle
              v-model="filtroMateria"
              toggle-color="primary"
              :options="filtrosMateriaOpcoes"
              spread
              unelevated
              dense
              style="--q-primary: #667eea"
            />
          </div>

          <!-- Ordenação -->
          <div class="row q-mb-md justify-end">
            <q-select
              v-model="ordenacaoConteudos"
              :options="opcoesOrdenacao"
              dense
              outlined
              style="min-width: 150px"
              :label="configs.textos?.ordenarPor || 'Ordenar por'"
            />
          </div>

          <!-- Grid de Conteúdos -->
          <div class="row q-col-gutter-md">
            <div v-if="conteudosFiltrados.length === 0" class="col-12 text-center q-py-xl">
              <q-icon name="store" size="64px" color="grey-3" />
              <div class="text-h6 text-grey-7 q-mt-md">{{ configs.mensagens?.vazio?.loja || 'Nenhum conteúdo encontrado' }}</div>
            </div>

            <div v-for="item in conteudosOrdenados" :key="item.id" class="col-6 col-md-3">
              <q-card flat bordered class="conteudo-card" @click="verDetalhesConteudo(item)">
                <q-img
                  :src="item.capa || configs.urls?.capa_padrao || 'https://cdn.quasar.dev/img/mountains.jpg'"
                  ratio="1"
                  @error="$event.target.src = configs.urls?.capa_padrao || 'https://cdn.quasar.dev/img/mountains.jpg'"
                >
                  <div class="absolute-top-left q-pa-xs">
                    <q-badge style="background: linear-gradient(135deg, #667eea, #764ba2)">
                      {{ obterNomeMateria(item.materia_id) }}
                    </q-badge>
                  </div>
                  <div class="absolute-bottom bg-transparent">
                    <div class="text-right">
                      <q-badge style="background: linear-gradient(135deg, #667eea, #764ba2)">{{ formatarPreco(item.preco) }}</q-badge>
                    </div>
                  </div>
                </q-img>
                <q-card-section class="q-pa-xs">
                  <div class="text-caption text-weight-bold lines-2">{{ item.titulo }}</div>
                  <div class="row items-center q-mt-xs">
                    <q-avatar size="16px" class="q-mr-xs">
                      <img
                        :src="item.explicador?.avatar || configs.urls?.avatar_explicador_padrao || 'https://cdn.quasar.dev/img/avatar3.jpg'"
                        @error="$event.target.src = configs.urls?.avatar_explicador_padrao || 'https://cdn.quasar.dev/img/avatar3.jpg'"
                      >
                    </q-avatar>
                    <span class="text-caption text-grey-7">{{ item.explicador?.nome || 'Explicador' }}</span>
                  </div>
                  <div class="row items-center q-mt-xs">
                    <q-rating :value="item.avaliacao || 0" size="12px" :max="5" color="accent" readonly />
                    <span class="text-caption q-ml-xs">({{ item.avaliacoes || 0 }})</span>
                  </div>
                  <q-btn
                    flat
                    :label="configs.textos?.botoes?.comprar || 'Comprar'"
                    size="sm"
                    class="full-width q-mt-xs"
                    style="color: #667eea"
                    @click.stop="comprarConteudo(item)"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Paginação -->
          <div class="row q-mt-md justify-center" v-if="totalPaginas > 1">
            <q-pagination
              v-model="paginaAtual"
              :max="totalPaginas"
              :max-pages="6"
              boundary-numbers
              direction-links
              icon-first="skip_previous"
              icon-last="skip_next"
              icon-prev="chevron_left"
              icon-next="chevron_right"
              color="primary"
              style="--q-primary: #667eea"
            />
          </div>
        </q-page>

        <!-- ==================== PERFIL ==================== -->
        <q-page v-if="tab === 'perfil'" class="q-pa-md">
          <div class="text-center q-mb-lg">
            <q-avatar size="100px" class="q-mb-sm cursor-pointer" @click="editarFoto">
              <img
                :src="userAvatar"
                @error="$event.target.src = configs.urls?.avatar_aluno_padrao || 'https://cdn.quasar.dev/img/avatar2.jpg'"
              >
              <q-badge floating color="primary" rounded style="background: linear-gradient(135deg, #667eea, #764ba2)">
                <q-icon name="edit" size="12px" />
              </q-badge>
            </q-avatar>
            <div class="text-h5 text-weight-bold" style="color: #667eea">{{ userNome }}</div>
            <div class="text-subtitle2 text-grey-7">{{ userEmail }}</div>
            <div class="text-caption text-grey-7">{{ userTelefone || 'Telefone não informado' }}</div>
          </div>

          <!-- Estatísticas -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5" style="color: #667eea">{{ estatisticas.pedidos }}</div>
                  <div class="text-caption">{{ configs.textos?.pedidos || 'Pedidos' }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5" style="color: #764ba2">{{ estatisticas.sessoes }}</div>
                  <div class="text-caption">{{ configs.textos?.sessoes || 'Sessões' }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5" style="color: #667eea">{{ estatisticas.conteudos }}</div>
                  <div class="text-caption">{{ configs.textos?.conteudos || 'Conteúdos' }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Informações Pessoais -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle1 text-weight-bold q-mb-sm" style="color: #667eea">{{ configs.textos?.informacoesPessoais || 'Informações Pessoais' }}</div>

              <div class="row q-mb-sm">
                <div class="col-4 text-grey-7">{{ configs.textos?.nome || 'Nome' }}:</div>
                <div class="col-8 text-weight-bold">{{ userNome }}</div>
              </div>

              <div class="row q-mb-sm">
                <div class="col-4 text-grey-7">Email:</div>
                <div class="col-8 text-weight-bold">{{ userEmail }}</div>
              </div>

              <div class="row q-mb-sm">
                <div class="col-4 text-grey-7">{{ configs.textos?.telefone || 'Telefone' }}:</div>
                <div class="col-8 text-weight-bold">{{ userTelefone || '—' }}</div>
              </div>

              <div class="row q-mb-sm">
                <div class="col-4 text-grey-7">{{ configs.textos?.nivel || 'Nível' }}:</div>
                <div class="col-8 text-weight-bold">{{ obterNomeNivel(userInfo?.nivel_id) || '—' }}</div>
              </div>

              <div class="row">
                <div class="col-4 text-grey-7">{{ configs.textos?.instituicao || 'Instituição' }}:</div>
                <div class="col-8 text-weight-bold">{{ userInfo?.instituicao || '—' }}</div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Menu -->
          <q-list bordered separator>
            <q-item clickable v-ripple @click="editarPerfil">
              <q-item-section avatar>
                <q-icon name="edit" style="color: #667eea" />
              </q-item-section>
              <q-item-section>{{ configs.textos?.menu?.editarPerfil || 'Editar Perfil' }}</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="verMetodosPagamento">
              <q-item-section avatar>
                <q-icon name="credit_card" style="color: #764ba2" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ configs.textos?.menu?.metodosPagamento || 'Métodos de Pagamento' }}</q-item-label>
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
              <q-item-section>{{ configs.textos?.menu?.configuracoes || 'Configurações' }}</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="ajuda">
              <q-item-section avatar>
                <q-icon name="help" color="info" />
              </q-item-section>
              <q-item-section>{{ configs.textos?.menu?.ajuda || 'Ajuda e Suporte' }}</q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="logout">
              <q-item-section avatar>
                <q-icon name="exit_to_app" color="negative" />
              </q-item-section>
              <q-item-section class="text-negative">{{ configs.textos?.menu?.sair || 'Sair' }}</q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </template>
    </q-page-container>

    <!-- ==================== DIÁLOGOS ==================== -->

    <!-- Diálogo Novo Pedido -->
    <q-dialog v-model="novoPedidoDialog" persistent maximized>
      <q-card>
        <q-card-section class="bg-primary text-white" style="background: linear-gradient(135deg, #667eea, #764ba2) !important">
          <div class="row items-center justify-between">
            <div class="text-h6">{{ dialogos.novo_pedido.titulo }}</div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="scroll q-pa-md">
          <!-- Matéria -->
          <q-select
            v-model="novoPedido.materia_id"
            :options="materiasOpcoes"
            :label="configs.textos?.formulario?.materia || 'Matéria *'"
            outlined
            class="q-mb-md"
            behavior="menu"
            use-input
            input-debounce="300"
            @filter="filtrarMaterias"
            :rules="[val => !!val || 'Matéria é obrigatória']"
          >
            <template v-slot:option="{ item }">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Título -->
          <q-input
            v-model="novoPedido.titulo"
            :label="configs.textos?.formulario?.titulo || 'Título *'"
            outlined
            class="q-mb-md"
            maxlength="100"
            counter
            :rules="[val => !!val || 'Título é obrigatório']"
          />

          <!-- Descrição -->
          <q-input
            v-model="novoPedido.descricao"
            :label="configs.textos?.formulario?.descricao || 'Descrição *'"
            type="textarea"
            outlined
            rows="4"
            class="q-mb-md"
            maxlength="500"
            counter
            :rules="[val => !!val || 'Descrição é obrigatória']"
          />

          <!-- Tipo de Serviço -->
          <q-select
            v-model="novoPedido.tipo_servico_id"
            :options="tiposServicoOpcoes"
            :label="configs.textos?.formulario?.tipoServico || 'Tipo de serviço *'"
            outlined
            class="q-mb-md"
            behavior="menu"
            :rules="[val => !!val || 'Tipo de serviço é obrigatório']"
          >
            <template v-slot:option="{ item }">
              <q-item>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption v-if="item.descricao">{{ item.descricao }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Nível -->
          <q-select
            v-model="novoPedido.nivel_id"
            :options="niveisOpcoes"
            :label="configs.textos?.formulario?.nivel || 'Nível *'"
            outlined
            class="q-mb-md"
            behavior="menu"
            :rules="[val => !!val || 'Nível é obrigatório']"
          />

          <!-- Duração -->
          <q-select
            v-model="novoPedido.duracao"
            :options="duracoesOpcoes"
            :label="configs.textos?.formulario?.duracao || 'Duração *'"
            outlined
            class="q-mb-md"
            behavior="menu"
            :rules="[val => !!val || 'Duração é obrigatória']"
          />

          <!-- Prazo -->
          <q-select
            v-model="novoPedido.prazo_id"
            :options="prazosOpcoes"
            :label="configs.textos?.formulario?.prazo || 'Prazo *'"
            outlined
            class="q-mb-md"
            behavior="menu"
            :rules="[val => !!val || 'Prazo é obrigatório']"
          >
            <template v-slot:option="{ item }">
              <q-item>
                <q-item-section avatar v-if="item.icone">
                  <q-icon :name="item.icone" :color="item.icone ? 'primary' : ''" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Seleção no Mapa (se prazo permitir) -->
          <div v-if="prazoSelecionado?.permite_mapa" class="q-mb-md">
            <q-btn
              flat
              style="color: #667eea"
              :label="configs.textos?.botoes?.selecionarNoMapa || 'Selecionar no mapa'"
              icon="map"
              class="full-width"
              @click="abrirMapaDialog = true"
            />
          </div>

          <!-- Local -->
          <q-select
            v-model="novoPedido.local"
            :options="locaisOpcoes"
            :label="configs.textos?.formulario?.local || 'Local *'"
            outlined
            class="q-mb-md"
            behavior="menu"
            use-input
            input-debounce="300"
            @filter="filtrarInstituicoes"
            :option-disable="opt => opt.tipo === 'personalizado'"
            :rules="[val => !!val || 'Local é obrigatório']"
          >
            <template v-slot:option="{ item }">
              <q-item>
                <q-item-section avatar v-if="item.icone">
                  <q-icon :name="item.icone" :color="item.icone ? 'secondary' : ''" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption v-if="item.endereco">{{ item.endereco }}</q-item-label>
                  <q-item-label caption v-if="item.distancia">📍 {{ item.distancia }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- Campo para "Outro" -->
          <q-input
            v-if="novoPedido.local === 'outro'"
            v-model="novoPedido.local_personalizado"
            :label="configs.textos?.formulario?.digiteEndereco || 'Digite o endereço'"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Endereço é obrigatório']"
          />

          <!-- Urgente -->
          <q-checkbox
            v-model="novoPedido.urgente"
            :label="configs.textos?.formulario?.urgente || 'É urgente?'"
            class="q-mb-md"
            color="primary"
            style="--q-primary: #667eea"
          />

          <!-- Valor -->
          <q-input
            v-model="novoPedido.preco"
            :label="configs.textos?.formulario?.valor || 'Valor (MZN) *'"
            type="number"
            outlined
            class="q-mb-md"
            :min="50"
            :rules="[val => val >= 50 || 'Valor mínimo é 50 MZN']"
          >
            <template v-slot:prepend>
              <span class="text-grey-7">MZN</span>
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat :label="dialogos.novo_pedido.botao_secundario_texto || 'Cancelar'"
            color="negative" v-close-popup
          />
          <q-btn
            style="background: linear-gradient(135deg, #667eea, #764ba2)"
            text-color="white"
            :label="dialogos.novo_pedido.botao_principal_texto || 'Publicar'"
            @click="criarPedido"
            :disable="!podePublicarPedido"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo Mapa -->
    <q-dialog v-model="abrirMapaDialog" maximized>
      <q-card>
        <q-card-section class="bg-primary text-white" style="background: linear-gradient(135deg, #667eea, #764ba2) !important">
          <div class="row items-center justify-between">
            <div class="text-h6">{{ dialogos.mapa.titulo }}</div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="mapa-container" style="height: 60vh; width: 100%">
            <!-- Aqui será integrado o mapa (Leaflet/Google Maps) -->
            <div class="text-center q-pa-xl">
              <q-icon name="map" size="64px" color="grey-4" />
              <p class="q-mt-md">Selecione sua localização no mapa</p>
              <q-btn
                flat
                :label="configs.textos?.botoes?.usarLocalizacaoAtual || 'Usar minha localização atual'"
                style="color: #667eea"
                icon="my_location"
                class="q-mt-md"
                @click="usarLocalizacaoAtual"
              />
            </div>
          </div>
          <div class="row q-mt-md">
            <q-btn
              flat
              :label="dialogos.mapa.botao_principal_texto || 'Confirmar localização'"
              style="background: linear-gradient(135deg, #667eea, #764ba2); color: white"
              class="full-width"
              @click="confirmarLocalizacaoMapa"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Diálogo Detalhes do Pedido -->
    <q-dialog v-model="detalhesPedidoDialog" maximized>
      <q-card>
        <q-card-section class="bg-primary text-white" style="background: linear-gradient(135deg, #667eea, #764ba2) !important">
          <div class="row items-center justify-between">
            <div class="text-h6">{{ dialogos.detalhes_pedido.titulo }}</div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="scroll" v-if="pedidoSelecionado">
          <div class="text-h6">{{ pedidoSelecionado.titulo }}</div>
          <div class="text-caption text-grey-7 q-mb-md">
            {{ configs.textos?.criadoEm || 'Criado em' }} {{ formatarData(pedidoSelecionado.created_at) }}
          </div>

          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">{{ configs.textos?.descricao || 'Descrição' }}</div>
              <div class="text-body2">{{ pedidoSelecionado.descricao }}</div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">{{ configs.textos?.detalhes || 'Detalhes' }}</div>
              <div class="row">
                <div class="col-6">Matéria: {{ obterNomeMateria(pedidoSelecionado.materia_id) }}</div>
                <div class="col-6">Nível: {{ obterNomeNivel(pedidoSelecionado.nivel_id) }}</div>
                <div class="col-6">Tipo: {{ obterNomeTipoServico(pedidoSelecionado.tipo_servico_id) }}</div>
                <div class="col-6">Duração: {{ pedidoSelecionado.duracao }}</div>
                <div class="col-6">Prazo: {{ obterNomePrazo(pedidoSelecionado.prazo_id) }}</div>
                <div class="col-6">Local: {{ pedidoSelecionado.local }}</div>
                <div class="col-12 text-primary text-weight-bold q-mt-md" style="color: #667eea">
                  Valor: {{ formatarPreco(pedidoSelecionado.preco) }}
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered v-if="pedidoSelecionado.propostas?.length > 0">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">
                {{ configs.textos?.propostas?.replace('{quantidade}', pedidoSelecionado.propostas.length) || `Propostas (${pedidoSelecionado.propostas.length})` }}
              </div>
              <div v-for="prop in pedidoSelecionado.propostas" :key="prop.id" class="q-mb-sm">
                <div class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders">
                  <div class="row items-center">
                    <q-avatar size="32px" class="q-mr-xs">
                      <img :src="prop.explicador?.avatar || configs.urls?.avatar_explicador_padrao">
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

        <q-card-actions align="right" class="q-pa-md">
          <q-btn
            flat :label="dialogos.detalhes_pedido.botao_principal_texto || 'Fechar'"
            style="color: #667eea" v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Erro -->
    <q-dialog v-model="erroDialog" full-width>
      <q-card>
        <q-card-section class="bg-negative text-white">
          <div class="text-h6">{{ dialogos.erro_padrao.titulo }}</div>
        </q-card-section>
        <q-card-section>
          <p class="text-body1">{{ erroMensagem }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="dialogos.erro_padrao.botao_principal_texto || 'OK'" color="white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Confirmação -->
    <q-dialog v-model="confirmacaoDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar :icon="confirmacaoIcone" :color="confirmacaoCor" text-color="white" size="40px" />
          <span class="q-ml-sm">{{ confirmacaoMensagem }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="dialogos[confirmacaoAcao]?.botao_secundario_texto || 'Cancelar'" color="primary" v-close-popup />
          <q-btn flat :label="dialogos[confirmacaoAcao]?.botao_principal_texto || 'Confirmar'" :color="confirmacaoCor || 'primary'" @click="confirmarAcao" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
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
    const menuPerfilAberto = ref(false)

    // Diálogos estáticos (não vêm da API)
    const dialogos = {
      aceitar_proposta: {
        tipo: 'confirmacao',
        titulo: 'Confirmar',
        mensagem: 'Deseja aceitar esta proposta?',
        botao_principal_texto: 'Aceitar',
        botao_secundario_texto: 'Cancelar',
        cor: 'positive'
      },
      comprar_conteudo: {
        tipo: 'confirmacao',
        titulo: 'Confirmar compra',
        mensagem: 'Deseja comprar este conteúdo?',
        botao_principal_texto: 'Comprar',
        botao_secundario_texto: 'Cancelar',
        cor: 'positive'
      },
      logout: {
        tipo: 'confirmacao',
        titulo: 'Sair',
        mensagem: 'Deseja realmente sair?',
        botao_principal_texto: 'Sair',
        botao_secundario_texto: 'Cancelar',
        cor: 'negative'
      },
      erro_padrao: {
        tipo: 'erro',
        titulo: 'Erro',
        mensagem: 'Ocorreu um erro. Tente novamente.',
        botao_principal_texto: 'OK',
        botao_secundario_texto: ''
      },
      extrato_saldo: {
        tipo: 'info',
        titulo: 'Extrato de Saldo',
        mensagem: '',
        botao_principal_texto: 'Fechar',
        botao_secundario_texto: ''
      },
      notificacoes: {
        tipo: 'info',
        titulo: 'Notificações',
        mensagem: 'Você não tem notificações no momento',
        botao_principal_texto: 'OK',
        botao_secundario_texto: ''
      },
      metodos_pagamento: {
        tipo: 'info',
        titulo: 'Métodos de Pagamento',
        mensagem: '',
        botao_principal_texto: 'Fechar',
        botao_secundario_texto: ''
      },
      configuracoes: {
        tipo: 'info',
        titulo: 'Configurações',
        mensagem: 'Função em desenvolvimento',
        botao_principal_texto: 'OK',
        botao_secundario_texto: ''
      },
      ajuda: {
        tipo: 'info',
        titulo: 'Ajuda e Suporte',
        mensagem: 'suporte@edulink.co.mz',
        botao_principal_texto: 'OK',
        botao_secundario_texto: ''
      },
      novo_pedido: {
        tipo: 'confirmacao',
        titulo: 'Novo Pedido de Ajuda',
        mensagem: '',
        botao_principal_texto: 'Publicar',
        botao_secundario_texto: 'Cancelar'
      },
      detalhes_pedido: {
        tipo: 'info',
        titulo: 'Detalhes do Pedido',
        mensagem: '',
        botao_principal_texto: 'Fechar',
        botao_secundario_texto: ''
      },
      mapa: {
        tipo: 'info',
        titulo: 'Selecionar no mapa',
        mensagem: '',
        botao_principal_texto: 'Confirmar localização',
        botao_secundario_texto: 'Cancelar'
      }
    }

    // Configurações do sistema (vindas da API)
    const configs = ref({
      materias: [],
      tiposServico: [],
      niveis: [],
      prazos: [],
      instituicoes: [],
      cores: { materia_padrao: 'primary' },
      icones: { materia_padrao: 'school' },
      urls: {
        avatar_aluno_padrao: 'https://cdn.quasar.dev/img/avatar2.jpg',
        avatar_explicador_padrao: 'https://cdn.quasar.dev/img/avatar3.jpg',
        capa_padrao: 'https://cdn.quasar.dev/img/mountains.jpg'
      },
      textos: {},
      titulos: {},
      subtitulos: {},
      mensagens: {}
    })

    // Diálogos
    const erroDialog = ref(false)
    const erroMensagem = ref('')
    const confirmacaoDialog = ref(false)
    const confirmacaoMensagem = ref('')
    const confirmacaoAcao = ref('')
    const confirmacaoCor = ref('primary')
    const confirmacaoIcone = ref('help')
    const acaoConfirmar = ref(null)
    const abrirMapaDialog = ref(false)

    // Dados do usuário
    const user = ref(Api.AuthService.getUser() || {})
    const userNome = computed(() => user.value?.nome || 'Estudante')
    const userEmail = computed(() => user.value?.email || '')
    const userTelefone = computed(() => user.value?.telefone || '')
    const userAvatar = computed(() => user.value?.avatar || configs.value.urls?.avatar_aluno_padrao)
    const userInfo = ref(null)
    const saldo = ref(0)
    const notificacoesNaoLidas = ref(0)

    // Estatísticas
    const estatisticas = ref({
      pedidos: 0,
      sessoes: 0,
      conteudos: 0
    })

    // ===== NOVAS VARIÁVEIS PARA O DASHBOARD =====
    const propostasDestaque = ref([])
    const totalPropostasPendentes = computed(() => propostasDestaque.value.length)
    const conteudosRelacionados = ref([])

    // ===== NOVAS VARIÁVEIS PARA O BANNER =====
    const bannerSlide = ref(1)
    const promocoesAtivas = ref([])
    const dicaDoDia = ref('Estude com flashcards para melhorar sua memória')

    const mensagemInformativa = computed(() => {
      const nome = userNome.value.split(' ')[0]
      const pedidosPendentes = pedidos.value.filter(p => p.status === 'Em negociação').length

      if (pedidosPendentes > 0) {
        return `${nome}, você tem ${pedidosPendentes} proposta(s) aguardando sua resposta!`
      } else if (bibliotecaCount.value === 0) {
        return `${nome}, que tal explorar nossa loja e começar sua biblioteca de conteúdos?`
      } else {
        return `${nome}, continue seus estudos! Você já tem ${bibliotecaCount.value} itens na sua biblioteca.`
      }
    })

    // Pedidos
    const filtroPedidos = ref('todos')
    const filtrosPedidosOpcoes = computed(() => [
      { label: configs.value.textos?.filtros?.todos || 'Todos', value: 'todos' },
      { label: configs.value.textos?.filtros?.ativos || 'Ativos', value: 'ativos' },
      { label: configs.value.textos?.filtros?.concluidos || 'Concluídos', value: 'concluidos' }
    ])

    const pedidos = ref([])
    const pedidosAtivos = computed(() => pedidos.value.filter(p => p.status !== 'Concluído').length)
    const pedidosFiltrados = computed(() => {
      if (filtroPedidos.value === 'todos') return pedidos.value
      if (filtroPedidos.value === 'ativos') return pedidos.value.filter(p => p.status !== 'Concluído')
      return pedidos.value.filter(p => p.status === 'Concluído')
    })

    // Biblioteca
    const filtroBiblioteca = ref('todos')
    const filtrosBibliotecaOpcoes = computed(() => [
      { label: configs.value.textos?.filtros?.todos || 'Todos', value: 'todos' },
      { label: configs.value.textos?.filtros?.favoritos || 'Favoritos', value: 'favoritos' },
      { label: configs.value.textos?.filtros?.conteudos || 'Conteúdos', value: 'conteudos' }
    ])

    const biblioteca = ref([])
    const bibliotecaCount = computed(() => biblioteca.value.length)
    const bibliotecaFiltrada = computed(() => {
      if (filtroBiblioteca.value === 'todos') return biblioteca.value
      if (filtroBiblioteca.value === 'favoritos') return biblioteca.value.filter(item => item.favorito)
      if (filtroBiblioteca.value === 'conteudos') return biblioteca.value.filter(item => item.tipo === 'conteudo')
      return biblioteca.value
    })

    // Loja
    const buscaConteudos = ref('')
    const filtroMateria = ref('todos')
    const ordenacaoConteudos = ref('recentes')
    const paginaAtual = ref(1)
    const totalPaginas = ref(1)

    const opcoesOrdenacao = [
      { label: 'Mais recentes', value: 'recentes' },
      { label: 'Menor preço', value: 'menor_preco' },
      { label: 'Maior preço', value: 'maior_preco' },
      { label: 'Melhor avaliação', value: 'avaliacao' }
    ]

    const filtrosMateriaOpcoes = computed(() => {
      const opcoes = [{ label: configs.value.textos?.filtros?.todos || 'Todos', value: 'todos' }]
      configs.value.materias?.forEach(m => {
        opcoes.push({ label: m.nome, value: m.id })
      })
      return opcoes
    })

    const conteudos = ref([])
    const conteudosFiltrados = computed(() => {
      let result = conteudos.value

      if (buscaConteudos.value) {
        result = result.filter(c =>
          c.titulo?.toLowerCase().includes(buscaConteudos.value.toLowerCase()) ||
          c.descricao?.toLowerCase().includes(buscaConteudos.value.toLowerCase())
        )
      }

      if (filtroMateria.value !== 'todos') {
        result = result.filter(c => c.materia_id === filtroMateria.value)
      }

      return result
    })

    const conteudosOrdenados = computed(() => {
      let result = [...conteudosFiltrados.value]

      if (ordenacaoConteudos.value === 'recentes') {
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      } else if (ordenacaoConteudos.value === 'menor_preco') {
        result.sort((a, b) => a.preco - b.preco)
      } else if (ordenacaoConteudos.value === 'maior_preco') {
        result.sort((a, b) => b.preco - a.preco)
      } else if (ordenacaoConteudos.value === 'avaliacao') {
        result.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0))
      }

      return result
    })

    // Opções para formulários
    const materiasOpcoes = computed(() => {
      return configs.value.materias?.map(m => ({
        label: m.nome,
        value: m.id
      })) || []
    })

    const tiposServicoOpcoes = computed(() => {
      return configs.value.tiposServico?.map(t => ({
        label: t.nome,
        value: t.id,
        descricao: t.descricao,
        icone: t.icone
      })) || []
    })

    const niveisOpcoes = computed(() => {
      return configs.value.niveis?.map(n => ({
        label: n.nome,
        value: n.id
      })) || []
    })

    const duracoesOpcoes = ref([
      { label: '30 min', value: '30 min' },
      { label: '45 min', value: '45 min' },
      { label: '60 min', value: '60 min' },
      { label: '90 min', value: '90 min' },
      { label: '120 min', value: '120 min' }
    ])

    const prazosOpcoes = computed(() => {
      return configs.value.prazos?.map(p => ({
        label: p.nome,
        value: p.id,
        icone: p.icone,
        permite_mapa: p.permite_mapa
      })) || []
    })

    const locaisOpcoes = computed(() => {
      const opcoes = [
        { label: 'Online', value: 'online', icone: 'computer', tipo: 'online' }
      ]

      configs.value.instituicoes?.forEach(inst => {
        opcoes.push({
          label: `Presencial - ${inst.nome}`,
          value: `inst_${inst.id}`,
          endereco: inst.endereco,
          distancia: inst.distancia,
          tipo: 'instituicao'
        })
      })

      opcoes.push({
        label: configs.value.textos?.formulario?.outro || 'Outro',
        value: 'outro',
        tipo: 'personalizado',
        icone: 'add_location'
      })

      return opcoes
    })

    const prazoSelecionado = computed(() => {
      return configs.value.prazos?.find(p => p.id === novoPedido.prazo_id)
    })

    // Diálogos
    const novoPedidoDialog = ref(false)
    const detalhesPedidoDialog = ref(false)
    const pedidoSelecionado = ref(null)

    // Formulário novo pedido
    const novoPedido = reactive({
      materia_id: '',
      titulo: '',
      descricao: '',
      tipo_servico_id: '',
      nivel_id: '',
      duracao: '',
      prazo_id: '',
      preco: 200,
      local: 'online',
      local_personalizado: '',
      urgente: false
    })

    const podePublicarPedido = computed(() => {
      return novoPedido.materia_id &&
             novoPedido.titulo &&
             novoPedido.descricao &&
             novoPedido.tipo_servico_id &&
             novoPedido.nivel_id &&
             novoPedido.duracao &&
             novoPedido.prazo_id &&
             novoPedido.preco >= 50 &&
             (novoPedido.local !== 'outro' || novoPedido.local_personalizado)
    })

    // ===== FUNÇÕES AUXILIARES =====
    const obterNomeMateria = (id) => {
      const materia = configs.value.materias?.find(m => m.id === id)
      return materia?.nome || 'Matéria'
    }

    const obterNomeNivel = (id) => {
      const nivel = configs.value.niveis?.find(n => n.id === id)
      return nivel?.nome || 'Nível'
    }

    const obterNomeTipoServico = (id) => {
      const tipo = configs.value.tiposServico?.find(t => t.id === id)
      return tipo?.nome || 'Tipo'
    }

    const obterNomePrazo = (id) => {
      const prazo = configs.value.prazos?.find(p => p.id === id)
      return prazo?.nome || 'Prazo'
    }

    // ===== CARREGAR CONFIGURAÇÕES =====
    const carregarConfiguracoes = async () => {
      try {
        const [
          materiasData,
          tiposData,
          niveisData,
          prazosData,
          sistemaData
        ] = await Promise.allSettled([
          Api.get('/configuracoes/materias'),
          Api.get('/configuracoes/tipos-servico'),
          Api.get('/configuracoes/niveis-ensino'),
          Api.get('/configuracoes/prazos'),
          Api.get('/configuracoes/sistema')
        ])

        if (materiasData.status === 'fulfilled') configs.value.materias = materiasData.value.materias || []
        if (tiposData.status === 'fulfilled') configs.value.tiposServico = tiposData.value.tiposServico || []
        if (niveisData.status === 'fulfilled') configs.value.niveis = niveisData.value.niveis || []
        if (prazosData.status === 'fulfilled') configs.value.prazos = prazosData.value.prazos || []
        if (sistemaData.status === 'fulfilled') {
          configs.value.urls = { ...configs.value.urls, ...sistemaData.value.urls }
          configs.value.textos = sistemaData.value.textos || {}
          configs.value.titulos = sistemaData.value.titulos || {}
          configs.value.subtitulos = sistemaData.value.subtitulos || {}
          configs.value.mensagens = sistemaData.value.mensagens || {}
        }

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords
              try {
                const data = await Api.get('/instituicoes/proximas', {
                  params: { lat: latitude, lng: longitude, raio: 10 }
                })
                configs.value.instituicoes = data.instituicoes || []
              } catch (error) {
                console.error('Erro ao buscar instituições:', error)
              }
            },
            (error) => {
              console.log('Geolocalização não permitida:', error)
            }
          )
        }

      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }

    // ===== CARREGAR DADOS =====
    const carregarDados = async () => {
      loading.value = true
      try {
        await carregarConfiguracoes()

        await Promise.all([
          carregarPedidos(),
          carregarBiblioteca(),
          carregarConteudos(),
          carregarPerfil(),
          carregarPropostasDestaque(),
          carregarConteudosRelacionados(),
          carregarPromocoes()
        ])
      } catch (error) {
        mostrarErro(Api.handleError(error))
      } finally {
        loading.value = false
      }
    }

    const carregarPedidos = async () => {
      try {
        const data = await Api.EstudanteService.getPedidos()
        pedidos.value = data.pedidos || []
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
        const params = {
          page: paginaAtual.value,
          busca: buscaConteudos.value,
          materia: filtroMateria.value !== 'todos' ? filtroMateria.value : null
        }
        const data = await Api.EstudanteService.getConteudos(params)
        conteudos.value = data.conteudos?.data || []
        totalPaginas.value = data.conteudos?.last_page || 1
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
        saldo.value = data.estudante?.saldo || 0
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
      }
    }

    // ===== NOVAS FUNÇÕES PARA O DASHBOARD =====
    const carregarPropostasDestaque = async () => {
      try {
        const pedidosComPropostas = pedidos.value.filter(p =>
          p.propostas && p.propostas.length > 0 && p.status === 'Em negociação'
        )

        const propostas = []
        pedidosComPropostas.forEach(p => {
          p.propostas.forEach(prop => {
            propostas.push({
              ...prop,
              pedido: p
            })
          })
        })

        propostasDestaque.value = propostas.slice(0, 3)
      } catch (error) {
        console.error('Erro ao carregar propostas:', error)
        propostasDestaque.value = []
      }
    }

    const carregarConteudosRelacionados = async () => {
      try {
        const nivelId = userInfo.value?.nivel_id
        if (nivelId) {
          const data = await Api.EstudanteService.getConteudos({
            nivel: nivelId,
            limit: 4
          })
          conteudosRelacionados.value = data.conteudos?.data?.slice(0, 4) || []
        } else {
          conteudosRelacionados.value = conteudos.value.slice(0, 4)
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdos relacionados:', error)
        conteudosRelacionados.value = []
      }
    }

    // ===== NOVAS FUNÇÕES PARA O BANNER =====
    const carregarPromocoes = async () => {
      try {
        // Simular busca de promoções
        // Na vida real, viria da API
        promocoesAtivas.value = [
          {
            id: 1,
            titulo: '50% off em Matemática',
            descricao: 'Pacote completo de Matemática com 50% de desconto',
            valor: 'de 2.500MT por 1.250MT',
            tag: 'SUPER PROMOÇÃO',
            imagem: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'
          }
        ]

        // Se não houver promoções, deixa o array vazio
        // promocoesAtivas.value = []
      } catch (error) {
        console.error('Erro ao carregar promoções:', error)
        promocoesAtivas.value = []
      }
    }

    const verPromocao = (promocao) => {
      $q.dialog({
        title: promocao.titulo,
        message: promocao.descricao,
        persistent: true
      })
    }

    const usarPromocao = (promocao) => {
      $q.notify({
        type: 'positive',
        message: 'Promoção aplicada com sucesso!',
        icon: 'local_offer'
      })
    }

    const recusarProposta = (propostaId) => {
      $q.dialog({
        title: 'Recusar proposta',
        message: 'Deseja realmente recusar esta proposta?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        await carregarPropostasDestaque()
      })
    }

    // ===== PEDIDOS =====
    const criarPedido = async () => {
      if (!podePublicarPedido.value) return

      try {
        const pedidoData = {
          ...novoPedido,
          local: novoPedido.local === 'outro' ? novoPedido.local_personalizado : novoPedido.local
        }
        await Api.EstudanteService.criarPedido(pedidoData)

        novoPedidoDialog.value = false
        await carregarPedidos()
        await carregarPropostasDestaque()

        Object.assign(novoPedido, {
          materia_id: '', titulo: '', descricao: '', tipo_servico_id: '',
          nivel_id: '', duracao: '', prazo_id: '', preco: 200, local: 'online',
          local_personalizado: '', urgente: false
        })
      } catch (error) {
        mostrarErro(Api.handleError(error))
      }
    }

    const aceitarProposta = async (propostaId) => {
      confirmarAcaoDialog(
        'aceitar_proposta',
        async () => {
          try {
            await Api.EstudanteService.aceitarProposta(propostaId)
            await carregarPedidos()
            await carregarPropostasDestaque()
          } catch (error) {
            mostrarErro(Api.handleError(error))
          }
        }
      )
    }

    const avaliarPedido = async (pedido) => {
      if (!pedido.avaliacaoTemp) return

      try {
        await Api.EstudanteService.avaliarSessao(pedido.id, { nota: pedido.avaliacaoTemp })
        pedido.avaliado = true
      } catch (error) {
        mostrarErro(Api.handleError(error))
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
      } catch (error) {
        mostrarErro(Api.handleError(error))
      }
    }

    const abrirItemBiblioteca = (item) => {
      $q.dialog({
        title: item.conteudo?.titulo || 'Conteúdo',
        message: `
          <b>Autor:</b> ${item.conteudo?.explicador?.nome}<br>
          <b>Progresso:</b> ${item.progresso}%<br><br>
          Deseja abrir este conteúdo?
        `,
        html: true,
        cancel: true,
        persistent: true
      }).onOk(() => {
        $q.notify({
          type: 'info',
          message: 'Abrindo conteúdo...'
        })
      })
    }

    // ===== LOJA =====
    const comprarConteudo = async (conteudo) => {
      confirmarAcaoDialog(
        'comprar_conteudo',
        async () => {
          try {
            await Api.EstudanteService.comprarConteudo(conteudo.id)
            await carregarBiblioteca()
          } catch (error) {
            mostrarErro(Api.handleError(error))
          }
        }
      )
    }

    const verDetalhesConteudo = (conteudo) => {
      $q.dialog({
        title: conteudo.titulo,
        message: `
          <b>Autor:</b> ${conteudo.explicador?.nome}<br>
          <b>Matéria:</b> ${obterNomeMateria(conteudo.materia_id)}<br>
          <b>Preço:</b> ${Api.formatarPreco(conteudo.preco)}<br><br>
          ${conteudo.descricao || 'Sem descrição'}
        `,
        html: true,
        persistent: true
      })
    }

    // ===== FILTROS =====
    const filtrarMaterias = (val, update) => {
      if (val === '') {
        update(() => {
          materiasOpcoes.value = configs.value.materias?.map(m => ({
            label: m.nome,
            value: m.id
          })) || []
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        materiasOpcoes.value = (configs.value.materias || [])
          .filter(m => m.nome.toLowerCase().includes(needle))
          .map(m => ({ label: m.nome, value: m.id }))
      })
    }

    const filtrarInstituicoes = async (val, update) => {
      if (val.length < 3) return

      try {
        const data = await Api.get('/instituicoes/busca', {
          params: { q: val }
        })
        update(() => {
          configs.value.instituicoes = data.instituicoes || []
        })
      } catch (error) {
        console.error('Erro ao buscar instituições:', error)
      }
    }

    // ===== MENU DO PERFIL =====
    const abrirMenuPerfil = () => {
      menuPerfilAberto.value = true
    }

    const irParaPerfil = () => {
      tab.value = 'perfil'
    }

    const editarFoto = () => {
      $q.dialog({
        title: 'Alterar foto',
        message: 'Função em desenvolvimento',
        persistent: true
      })
    }

    // ===== OUTRAS AÇÕES =====
    const verExtrato = () => {
      $q.dialog({
        title: dialogos.extrato_saldo.titulo,
        message: `
          <div class="text-center q-mb-md">
            <div class="text-h4 text-primary">${formatarPreco(saldo.value)}</div>
            <div class="text-caption">Saldo disponível</div>
          </div>
        `,
        html: true,
        persistent: true
      })
    }

    const abrirNotificacoes = () => {
      $q.dialog({
        title: dialogos.notificacoes.titulo,
        message: dialogos.notificacoes.mensagem,
        persistent: true
      })
    }

    const abrirChat = (explicador) => {
      $q.notify({
        type: 'info',
        message: `Abrindo chat com ${explicador?.nome || 'explicador'}`
      })
    }

    const editarPerfil = () => {
      $q.dialog({
        title: 'Editar Perfil',
        prompt: {
          model: user.value.nome,
          label: configs.value.textos?.formulario?.nome || 'Nome completo'
        },
        cancel: true,
        persistent: true
      }).onOk(async (nome) => {
        try {
          await Api.AuthService.updateProfile({ nome })
          user.value.nome = nome
        } catch (error) {
          mostrarErro(Api.handleError(error))
        }
      })
    }

    const verMetodosPagamento = () => {
      $q.dialog({
        title: dialogos.metodos_pagamento.titulo,
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
        title: dialogos.configuracoes.titulo,
        message: dialogos.configuracoes.mensagem,
        persistent: true
      })
    }

    const ajuda = () => {
      $q.dialog({
        title: dialogos.ajuda.titulo,
        message: dialogos.ajuda.mensagem,
        persistent: true
      })
    }

    const logout = () => {
      confirmarAcaoDialog(
        'logout',
        async () => {
          try {
            await Api.AuthService.logout()
            router.push('/login')
          } catch (error) {
            router.push('/login')
          }
        }
      )
    }

    const usarLocalizacaoAtual = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords
            try {
              const data = await Api.get('/instituicoes/proximas', {
                params: { lat: latitude, lng: longitude, raio: 5 }
              })
              configs.value.instituicoes = data.instituicoes || []
              $q.notify({
                type: 'positive',
                message: `Encontradas ${data.instituicoes?.length || 0} instituições próximas`
              })
            } catch (error) {
              console.error('Erro ao buscar instituições:', error)
            }
          },
          (error) => {
            $q.notify({
              type: 'negative',
              message: 'Não foi possível obter sua localização'
            })
          }
        )
      }
    }

    const confirmarLocalizacaoMapa = () => {
      abrirMapaDialog.value = false
      $q.notify({
        type: 'positive',
        message: 'Localização selecionada com sucesso!'
      })
    }

    // ===== DIÁLOGO DE CONFIRMAÇÃO =====
    const confirmarAcaoDialog = (acao, funcao) => {
      const dialogo = dialogos[acao]
      if (!dialogo) return

      confirmacaoMensagem.value = dialogo.mensagem
      confirmacaoAcao.value = acao
      confirmacaoCor.value = dialogo.cor || 'primary'
      confirmacaoIcone.value = dialogo.tipo === 'confirmacao' ? 'help' : 'info'
      acaoConfirmar.value = funcao
      confirmacaoDialog.value = true
    }

    const confirmarAcao = () => {
      if (acaoConfirmar.value) {
        acaoConfirmar.value()
      }
    }

    const mostrarErro = (mensagem) => {
      erroMensagem.value = mensagem
      erroDialog.value = true
    }

    // ===== UTILITÁRIOS =====
    const formatarPreco = (valor) => {
      return Api.formatarPreco(valor)
    }

    const formatarData = (data) => {
      if (!data) return 'Data desconhecida'
      return new Date(data).toLocaleDateString('pt-MZ')
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

    const recarregarConteudos = () => {
      carregarConteudos()
    }

    watch(buscaConteudos, () => {
      paginaAtual.value = 1
      recarregarConteudos()
    })

    watch(filtroMateria, () => {
      paginaAtual.value = 1
      recarregarConteudos()
    })

    watch(paginaAtual, () => {
      recarregarConteudos()
    })

    onMounted(() => {
      carregarDados()
    })

    return {
      // Estado
      loading,
      tab,
      menuPerfilAberto,
      user,
      userNome,
      userEmail,
      userTelefone,
      userAvatar,
      userInfo,
      saldo,
      notificacoesNaoLidas,
      estatisticas,

      // Configurações
      configs,
      dialogos,

      // Dashboard
      propostasDestaque,
      totalPropostasPendentes,
      conteudosRelacionados,

      // Banner
      bannerSlide,
      promocoesAtivas,
      dicaDoDia,
      mensagemInformativa,
      verPromocao,
      usarPromocao,

      // Pedidos
      filtroPedidos,
      filtrosPedidosOpcoes,
      pedidos,
      pedidosAtivos,
      pedidosFiltrados,

      // Biblioteca
      filtroBiblioteca,
      filtrosBibliotecaOpcoes,
      biblioteca,
      bibliotecaCount,
      bibliotecaFiltrada,

      // Loja
      buscaConteudos,
      filtroMateria,
      filtrosMateriaOpcoes,
      ordenacaoConteudos,
      opcoesOrdenacao,
      paginaAtual,
      totalPaginas,
      conteudos,
      conteudosFiltrados,
      conteudosOrdenados,

      // Opções
      materiasOpcoes,
      tiposServicoOpcoes,
      niveisOpcoes,
      duracoesOpcoes,
      prazosOpcoes,
      locaisOpcoes,
      prazoSelecionado,

      // Diálogos
      novoPedidoDialog,
      detalhesPedidoDialog,
      pedidoSelecionado,
      novoPedido,
      podePublicarPedido,
      erroDialog,
      erroMensagem,
      confirmacaoDialog,
      confirmacaoMensagem,
      confirmacaoAcao,
      confirmacaoCor,
      confirmacaoIcone,
      abrirMapaDialog,

      // Funções auxiliares
      obterNomeMateria,
      obterNomeNivel,
      obterNomeTipoServico,
      obterNomePrazo,

      // Métodos
      abrirMenuPerfil,
      irParaPerfil,
      editarFoto,
      carregarDados,
      criarPedido,
      aceitarProposta,
      recusarProposta,
      avaliarPedido,
      verDetalhesPedido,
      toggleFavorito,
      abrirItemBiblioteca,
      comprarConteudo,
      verDetalhesConteudo,
      filtrarMaterias,
      filtrarInstituicoes,
      verExtrato,
      abrirNotificacoes,
      abrirChat,
      editarPerfil,
      verMetodosPagamento,
      configuracoes,
      ajuda,
      logout,
      usarLocalizacaoAtual,
      confirmarLocalizacaoMapa,
      confirmarAcao,
      mostrarErro,

      // Utilitários
      formatarPreco,
      formatarData,
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

.proposta-card,
.biblioteca-card,
.conteudo-card {
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.proposta-card:hover,
.biblioteca-card:hover,
.conteudo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.banner-promocional {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 24px;
  overflow: hidden;
}

.banner-promocional:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(102, 126, 234, 0.4);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
}

.banner-conteudo {
  padding: 24px;
}

.banner-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.banner-titulo {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.banner-descricao {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 16px;
}

.banner-acoes {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner-valor {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.banner-btn {
  border-radius: 20px;
  padding: 4px 16px;
}

.banner-informativo {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 30px -10px rgba(102, 126, 234, 0.3);
}

.banner-info {
  padding: 24px;
  position: relative;
  z-index: 1;
}

.banner-info-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}

.banner-info-titulo {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
}

.banner-info-texto {
  margin-bottom: 20px;
}

.stat-card {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
}

.banner-info-dicas {
  background: rgba(255,255,255,0.2);
  border-radius: 16px;
  padding: 16px;
}

.dica-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-ilustracao {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
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

.mapa-container {
  width: 100%;
  height: 300px;
  background: #f5f5f5;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .banner-info-titulo {
    font-size: 22px;
  }

  .banner-info-texto {
    font-size: 14px;
  }

  .stat-number {
    font-size: 20px;
  }

  .banner-ilustracao img {
    max-height: 150px;
  }
}
</style>
