<template>
  <q-layout view="hHh LpR fFf">
    <!-- Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-avatar>
          <img 
            :src="userAvatar" 
            @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar3.jpg'"
          >
        </q-avatar>
        <q-toolbar-title>
          {{ userNome }}
          <div class="text-caption">{{ userMaterias }}</div>
        </q-toolbar-title>

        <!-- Saldo -->
        <q-chip 
          dense 
          class="bg-white text-primary q-mr-sm cursor-pointer" 
          @click="verExtrato"
        >
          <q-avatar icon="account_balance_wallet" color="primary" text-color="white" />
          {{ formatarPreco(saldo) }}
        </q-chip>

        <q-btn flat round dense icon="notifications" @click="abrirNotificacoes">
          <q-badge v-if="notificacoesNaoLidas > 0" color="red" floating>{{ notificacoesNaoLidas }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Navegação Inferior -->
    <q-footer class="bg-white text-dark">
      <q-tabs 
        v-model="tab" 
        dense 
        class="text-grey-7" 
        active-color="primary" 
        indicator-color="primary" 
        align="justify"
      >
        <q-tab name="disponiveis" icon="search">
          <span class="tab-label">Disponíveis</span>
          <q-badge v-if="pedidosDisponiveis.length > 0" color="red" floating>{{ pedidosDisponiveis.length }}</q-badge>
        </q-tab>
        <q-tab name="propostas" icon="payments">
          <span class="tab-label">Propostas</span>
          <q-badge v-if="minhasPropostas.length > 0" color="orange" floating>{{ minhasPropostas.length }}</q-badge>
        </q-tab>
        <q-tab name="ativos" icon="play_circle">
          <span class="tab-label">Ativos</span>
          <q-badge v-if="pedidosAtivos.length > 0" color="green" floating>{{ pedidosAtivos.length }}</q-badge>
        </q-tab>
        <q-tab name="concluidos" icon="check_circle">
          <span class="tab-label">Concluídos</span>
          <q-badge v-if="pedidosConcluidos.length > 0" color="grey" floating>{{ pedidosConcluidos.length }}</q-badge>
        </q-tab>
        <q-tab name="conteudos" icon="menu_book">
          <span class="tab-label">Conteúdos</span>
          <q-badge v-if="meusConteudos.length > 0" color="accent" floating>{{ meusConteudos.length }}</q-badge>
        </q-tab>
        <q-tab name="perfil" icon="person">
          <span class="tab-label">Perfil</span>
        </q-tab>
      </q-tabs>
    </q-footer>

    <!-- Conteúdo Principal -->
    <q-page-container>
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <q-spinner color="primary" size="3em" />
        <p class="q-mt-md text-grey-7">Carregando seus dados...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <q-icon name="error_outline" size="64px" color="negative" />
        <p class="text-h6 q-mt-md">{{ error }}</p>
        <q-btn color="primary" label="Tentar novamente" @click="carregarDados" class="q-mt-md" />
      </div>

      <!-- Conteúdo -->
      <template v-else>
        <!-- ==================== PEDIDOS DISPONÍVEIS ==================== -->
        <q-page v-if="tab === 'disponiveis'" class="q-pa-md">
          <!-- Stats Rápidos -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center q-pa-sm">
                  <div class="text-h6 text-primary">{{ stats.pedidosHoje }}</div>
                  <div class="text-caption">Hoje</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center q-pa-sm">
                  <div class="text-h6 text-secondary">{{ stats.pedidosSemana }}</div>
                  <div class="text-caption">Semana</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center q-pa-sm">
                  <div class="text-h6 text-accent">{{ stats.taxaAceitacao }}%</div>
                  <div class="text-caption">Aceitação</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Filtros em Chips -->
          <div class="filters-container q-mb-md">
            <q-chip
              v-for="filtro in filtrosDisponiveis"
              :key="filtro.value"
              :color="filtroDisponivel === filtro.value ? 'primary' : 'grey-3'"
              :text-color="filtroDisponivel === filtro.value ? 'white' : 'grey-8'"
              class="filter-chip cursor-pointer"
              clickable
              @click="filtroDisponivel = filtro.value"
            >
              {{ filtro.label }}
            </q-chip>
          </div>

          <!-- Busca -->
          <q-input
            v-model="buscaDisponiveis"
            outlined
            dense
            placeholder="Buscar por título ou matéria..."
            class="q-mb-md"
            debounce="300"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon v-if="buscaDisponiveis" name="close" class="cursor-pointer" @click="buscaDisponiveis = ''" />
            </template>
          </q-input>

          <!-- Lista de Pedidos Disponíveis -->
          <div v-if="pedidosDisponiveisFiltrados.length === 0" class="empty-state">
            <q-icon name="inbox" size="64px" color="grey-4" />
            <p class="text-h6 text-grey-7 q-mt-md">Nenhum pedido disponível</p>
            <p class="text-grey-6">Novos pedidos aparecerão aqui automaticamente</p>
          </div>

          <div class="row q-col-gutter-md">
            <div v-for="pedido in pedidosDisponiveisFiltrados" :key="pedido.id" class="col-12">
              <q-card flat bordered class="pedido-card">
                <q-card-section>
                  <!-- Cabeçalho -->
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar size="40px" class="q-mr-sm">
                        <img 
                          :src="pedido.estudante?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'"
                          @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar2.jpg'"
                        >
                      </q-avatar>
                      <div>
                        <div class="text-subtitle2 text-weight-bold">{{ pedido.titulo || 'Sem título' }}</div>
                        <div class="row items-center">
                          <span class="text-caption text-grey-7">{{ pedido.estudante?.nome || 'Estudante' }}</span>
                          <span class="text-caption text-grey-7 q-mx-xs">•</span>
                          <q-icon name="schedule" size="14px" class="text-grey-7 q-mr-xs" />
                          <span class="text-caption text-grey-7">{{ timeAgo(pedido.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                    <q-badge v-if="pedido.urgente" color="negative" rounded>Urgente</q-badge>
                  </div>

                  <!-- Tags -->
                  <div class="row q-mt-sm">
                    <q-chip size="sm" outline color="primary" class="q-mr-xs">
                      <q-avatar icon="school" color="primary" size="14px" />
                      {{ pedido.materia || 'Matéria' }}
                    </q-chip>
                    <q-chip size="sm" outline color="secondary" class="q-mr-xs">
                      <q-avatar icon="schedule" color="secondary" size="14px" />
                      {{ pedido.duracao || '60 min' }}
                    </q-chip>
                    <q-chip size="sm" outline color="accent">
                      <q-avatar icon="location_on" color="accent" size="14px" />
                      {{ pedido.local || 'Online' }}
                    </q-chip>
                  </div>

                  <!-- Descrição -->
                  <p class="text-body2 q-mt-sm q-mb-sm">{{ truncate(pedido.descricao, 120) || 'Sem descrição' }}</p>

                  <!-- Ações -->
                  <div class="row items-center justify-between q-mt-md">
                    <div>
                      <span class="text-grey-7 text-caption">Oferece:</span>
                      <span class="text-primary text-weight-bold q-ml-sm">{{ formatarPreco(pedido.preco) }}</span>
                    </div>
                    <div class="row">
                      <q-btn 
                        flat 
                        round 
                        color="negative" 
                        icon="close" 
                        size="sm" 
                        @click="recusarPedido(pedido)"
                      >
                        <q-tooltip>Recusar pedido</q-tooltip>
                      </q-btn>
                      <q-btn 
                        flat 
                        round 
                        color="warning" 
                        icon="payments" 
                        size="sm" 
                        @click="abrirNegociacao(pedido)"
                      >
                        <q-tooltip>Fazer contraproposta</q-tooltip>
                      </q-btn>
                      <q-btn 
                        flat 
                        round 
                        color="positive" 
                        icon="check" 
                        size="sm" 
                        @click="aceitarPedido(pedido)"
                      >
                        <q-tooltip>Aceitar pedido</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- ==================== MINHAS PROPOSTAS ==================== -->
        <q-page v-if="tab === 'propostas'" class="q-pa-md">
          <div v-if="minhasPropostas.length === 0" class="empty-state">
            <q-icon name="payments" size="64px" color="grey-4" />
            <p class="text-h6 text-grey-7 q-mt-md">Nenhuma proposta enviada</p>
            <p class="text-grey-6">Suas propostas aparecerão aqui</p>
          </div>

          <div class="row q-col-gutter-md">
            <div v-for="proposta in minhasPropostas" :key="proposta.id" class="col-12">
              <q-card flat bordered class="pedido-card">
                <q-card-section>
                  <!-- Cabeçalho -->
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar size="40px" class="q-mr-sm">
                        <img 
                          :src="proposta.estudante?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'"
                          @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar2.jpg'"
                        >
                      </q-avatar>
                      <div>
                        <div class="text-subtitle2 text-weight-bold">{{ proposta.titulo || 'Sem título' }}</div>
                        <div class="row items-center">
                          <span class="text-caption text-grey-7">{{ proposta.estudante?.nome || 'Estudante' }}</span>
                          <span class="text-caption text-grey-7 q-mx-xs">•</span>
                          <q-icon name="schedule" size="14px" class="text-grey-7 q-mr-xs" />
                          <span class="text-caption text-grey-7">{{ timeAgo(proposta.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                    <q-badge color="warning" rounded>Proposta enviada</q-badge>
                  </div>

                  <!-- Tags -->
                  <div class="row q-mt-sm">
                    <q-chip size="sm" outline color="primary" class="q-mr-xs">
                      <q-avatar icon="school" color="primary" size="14px" />
                      {{ proposta.materia || 'Matéria' }}
                    </q-chip>
                    <q-chip size="sm" outline color="secondary" class="q-mr-xs">
                      <q-avatar icon="schedule" color="secondary" size="14px" />
                      {{ proposta.duracao || '60 min' }}
                    </q-chip>
                    <q-chip v-if="proposta.urgente" size="sm" color="negative" text-color="white">
                      Urgente
                    </q-chip>
                  </div>

                  <!-- Detalhes da Proposta -->
                  <div class="q-mt-md bg-warning-light q-pa-md rounded-borders">
                    <div class="row items-center justify-between">
                      <div>
                        <span class="text-caption text-grey-7">Sua proposta:</span>
                        <span class="text-primary text-weight-bold text-h6 q-ml-sm">{{ formatarPreco(proposta.proposta_valor) }}</span>
                      </div>
                      <div>
                        <span class="text-caption text-grey-7">Original:</span>
                        <span class="text-grey-7 q-ml-sm">{{ formatarPreco(proposta.preco_original) }}</span>
                      </div>
                    </div>
                    <p v-if="proposta.proposta_mensagem" class="text-caption q-mt-md">
                      "{{ proposta.proposta_mensagem }}"
                    </p>
                  </div>

                  <!-- Status da proposta -->
                  <div class="row items-center q-mt-sm">
                    <q-icon name="hourglass_empty" size="16px" class="text-warning q-mr-xs" />
                    <span class="text-caption text-warning">Aguardando resposta do estudante</span>
                  </div>

                  <!-- Ações -->
                  <div class="row items-center justify-end q-mt-md">
                    <q-btn 
                      flat 
                      color="negative" 
                      label="Cancelar proposta" 
                      size="sm" 
                      @click="cancelarProposta(proposta)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- ==================== PEDIDOS ATIVOS ==================== -->
        <q-page v-if="tab === 'ativos'" class="q-pa-md">
          <div v-if="pedidosAtivos.length === 0" class="empty-state">
            <q-icon name="play_circle" size="64px" color="grey-4" />
            <p class="text-h6 text-grey-7 q-mt-md">Nenhum pedido ativo</p>
            <p class="text-grey-6">Acompanhe aqui seus pedidos aceitos</p>
          </div>

          <div class="row q-col-gutter-md">
            <div v-for="pedido in pedidosAtivos" :key="pedido.id" class="col-12">
              <q-card flat bordered class="pedido-card">
                <q-card-section>
                  <!-- Cabeçalho -->
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar size="40px" class="q-mr-sm">
                        <img 
                          :src="pedido.estudante?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'"
                          @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar2.jpg'"
                        >
                      </q-avatar>
                      <div>
                        <div class="text-subtitle2 text-weight-bold">{{ pedido.titulo || 'Sem título' }}</div>
                        <div class="row items-center">
                          <span class="text-caption text-grey-7">{{ pedido.estudante?.nome || 'Estudante' }}</span>
                          <span class="text-caption text-grey-7 q-mx-xs">•</span>
                          <q-icon name="schedule" size="14px" class="text-grey-7 q-mr-xs" />
                          <span class="text-caption text-grey-7">{{ timeAgo(pedido.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                    <q-badge color="positive" rounded>Ativo</q-badge>
                  </div>

                  <!-- Tags -->
                  <div class="row q-mt-sm">
                    <q-chip size="sm" outline color="primary" class="q-mr-xs">
                      <q-avatar icon="school" color="primary" size="14px" />
                      {{ pedido.materia || 'Matéria' }}
                    </q-chip>
                    <q-chip size="sm" outline color="secondary" class="q-mr-xs">
                      <q-avatar icon="schedule" color="secondary" size="14px" />
                      {{ pedido.duracao || '60 min' }}
                    </q-chip>
                  </div>

                  <!-- Valor Combinado -->
                  <div class="q-mt-md bg-positive-light q-pa-md rounded-borders">
                    <div class="row items-center justify-between">
                      <span class="text-caption text-weight-bold">Valor combinado:</span>
                      <span class="text-primary text-weight-bold text-h6">{{ formatarPreco(pedido.preco_combinado || pedido.preco) }}</span>
                    </div>
                  </div>

                  <!-- Informações da sessão -->
                  <div v-if="pedido.data_sessao" class="q-mt-md">
                    <q-card flat bordered class="bg-info-light">
                      <q-card-section class="q-pa-sm">
                        <div class="row items-center">
                          <q-icon name="event" size="20px" class="text-info q-mr-sm" />
                          <span class="text-caption">Sessão agendada:</span>
                          <span class="text-caption text-weight-bold q-ml-sm">{{ formatarDataHora(pedido.data_sessao) }}</span>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- Botões Ação -->
                  <div class="row q-mt-md q-col-gutter-sm">
                    <div class="col-4">
                      <q-btn 
                        flat 
                        label="Iniciar" 
                        color="positive" 
                        icon="play_circle" 
                        class="full-width" 
                        @click="iniciarSessao(pedido)"
                      />
                    </div>
                    <div class="col-4">
                      <q-btn 
                        flat 
                        label="Chat" 
                        color="primary" 
                        icon="chat" 
                        class="full-width" 
                        @click="abrirChat(pedido.estudante)"
                      />
                    </div>
                    <div class="col-4">
                      <q-btn 
                        flat 
                        label="Agendar" 
                        color="secondary" 
                        icon="event" 
                        class="full-width" 
                        @click="abrirAgendamento(pedido)"
                      />
                    </div>
                  </div>

                  <!-- Botão concluir -->
                  <div class="row q-mt-sm">
                    <q-btn 
                      flat 
                      label="Marcar como concluído" 
                      color="grey" 
                      icon="check" 
                      class="full-width" 
                      @click="concluirPedido(pedido)"
                    />
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- ==================== PEDIDOS CONCLUÍDOS ==================== -->
        <q-page v-if="tab === 'concluidos'" class="q-pa-md">
          <div v-if="pedidosConcluidos.length === 0" class="empty-state">
            <q-icon name="check_circle" size="64px" color="grey-4" />
            <p class="text-h6 text-grey-7 q-mt-md">Nenhum pedido concluído</p>
          </div>

          <div class="row q-col-gutter-md">
            <div v-for="pedido in pedidosConcluidos" :key="pedido.id" class="col-12">
              <q-card flat bordered class="pedido-card">
                <q-card-section>
                  <!-- Cabeçalho -->
                  <div class="row items-center justify-between">
                    <div class="row items-center">
                      <q-avatar size="40px" class="q-mr-sm">
                        <img 
                          :src="pedido.estudante?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'"
                          @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar2.jpg'"
                        >
                      </q-avatar>
                      <div>
                        <div class="text-subtitle2 text-weight-bold">{{ pedido.titulo || 'Sem título' }}</div>
                        <div class="row items-center">
                          <span class="text-caption text-grey-7">{{ pedido.estudante?.nome || 'Estudante' }}</span>
                          <span class="text-caption text-grey-7 q-mx-xs">•</span>
                          <q-icon name="schedule" size="14px" class="text-grey-7 q-mr-xs" />
                          <span class="text-caption text-grey-7">{{ formatarData(pedido.created_at) }}</span>
                        </div>
                      </div>
                    </div>
                    <q-badge color="grey-7" rounded>Concluído</q-badge>
                  </div>

                  <!-- Avaliação -->
                  <div class="row items-center justify-between q-mt-md">
                    <div class="row items-center">
                      <q-icon name="star" color="accent" size="20px" class="q-mr-xs" />
                      <span class="text-weight-bold">{{ pedido.avaliacao?.nota || 'Aguardando avaliação' }}</span>
                    </div>
                    <div class="text-grey-7 text-weight-bold">{{ formatarPreco(pedido.preco_combinado || pedido.preco) }}</div>
                  </div>

                  <!-- Botão publicar conteúdo -->
                  <q-btn
                    flat
                    color="primary"
                    label="Publicar como conteúdo pago"
                    icon="upload"
                    class="full-width q-mt-md"
                    @click="prepararPublicacao(pedido)"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- ==================== MEUS CONTEÚDOS ==================== -->
        <q-page v-if="tab === 'conteudos'" class="q-pa-md">
          <!-- Stats Rápidos -->
          <div class="row q-col-gutter-sm q-mb-md">
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center q-pa-sm">
                  <div class="text-h6 text-primary">{{ meusConteudos.length }}</div>
                  <div class="text-caption">Total</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center q-pa-sm">
                  <div class="text-h6 text-secondary">{{ totalVendas }}</div>
                  <div class="text-caption">Vendas</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center q-pa-sm">
                  <div class="text-h6 text-accent">{{ formatarPreco(totalReceita) }}</div>
                  <div class="text-caption">Receita</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Botão Novo Conteúdo -->
          <div class="row q-mb-md">
            <q-btn
              color="primary"
              label="Publicar novo conteúdo"
              icon="add"
              unelevated
              class="full-width"
              @click="publicarConteudoDialog = true"
            />
          </div>

          <!-- Filtros -->
          <div class="row q-mb-md">
            <q-btn-toggle
              v-model="filtroConteudos"
              toggle-color="primary"
              :options="[
                { label: 'Todos', value: 'todos' },
                { label: 'Ativos', value: 'ativos' },
                { label: 'Mais vendidos', value: 'top' }
              ]"
              spread
              unelevated
              dense
            />
          </div>

          <!-- Lista de Conteúdos -->
          <div v-if="meusConteudosFiltrados.length === 0" class="empty-state">
            <q-icon name="menu_book" size="64px" color="grey-4" />
            <p class="text-h6 text-grey-7 q-mt-md">Nenhum conteúdo publicado</p>
            <q-btn color="primary" label="Publicar agora" class="q-mt-md" @click="publicarConteudoDialog = true" />
          </div>

          <div class="row q-col-gutter-md">
            <div 
              v-for="conteudo in meusConteudosFiltrados" 
              :key="conteudo.id" 
              class="col-12 col-sm-6 col-md-4"
            >
              <q-card flat bordered class="conteudo-card">
                <q-img
                  :src="conteudo.capa || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400'"
                  ratio="16/9"
                  class="rounded-top"
                >
                  <div class="absolute-top-left q-pa-xs">
                    <q-badge :color="conteudo.status === 'Ativo' ? 'positive' : 'grey-7'">
                      {{ conteudo.status }}
                    </q-badge>
                  </div>
                  <div class="absolute-bottom bg-transparent">
                    <div class="row items-center justify-end">
                      <q-badge color="primary" class="q-pa-xs">
                        {{ formatarPreco(conteudo.preco) }}
                      </q-badge>
                    </div>
                  </div>
                </q-img>

                <q-card-section>
                  <div class="text-subtitle2 text-weight-bold lines-2">{{ conteudo.titulo }}</div>
                  
                  <div class="row items-center q-mt-xs">
                    <q-icon name="star" color="accent" size="16px" />
                    <span class="text-caption q-ml-xs">{{ conteudo.avaliacao_media || 0 }}</span>
                    <span class="text-caption text-grey-7 q-ml-xs">({{ conteudo.total_avaliacoes || 0 }})</span>
                  </div>

                  <div class="row q-mt-sm">
                    <div class="col-6 text-center">
                      <div class="text-caption text-weight-bold">{{ conteudo.visualizacoes || 0 }}</div>
                      <div class="text-caption text-grey-6">views</div>
                    </div>
                    <div class="col-6 text-center">
                      <div class="text-caption text-weight-bold">{{ conteudo.vendas_count || 0 }}</div>
                      <div class="text-caption text-grey-6">vendas</div>
                    </div>
                  </div>

                  <div class="row q-mt-sm q-col-gutter-xs">
                    <div class="col-6">
                      <q-btn 
                        flat 
                        color="primary" 
                        icon="edit" 
                        label="Editar" 
                        size="sm" 
                        class="full-width"
                        @click="editarConteudo(conteudo)"
                      />
                    </div>
                    <div class="col-6">
                      <q-btn 
                        flat
                        :color="conteudo.status === 'Ativo' ? 'negative' : 'positive'"
                        :icon="conteudo.status === 'Ativo' ? 'pause' : 'play_arrow'"
                        :label="conteudo.status === 'Ativo' ? 'Desativar' : 'Ativar'"
                        size="sm"
                        class="full-width"
                        @click="toggleConteudoStatus(conteudo)"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-page>

        <!-- ==================== PERFIL ==================== -->
        <q-page v-if="tab === 'perfil'" class="q-pa-md">
          <!-- Foto e Nome -->
          <div class="text-center q-mb-lg">
            <q-avatar size="100px" class="q-mb-sm">
              <img 
                :src="userAvatar" 
                @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar3.jpg'"
              >
              <q-badge floating color="positive" rounded />
            </q-avatar>
            <div class="text-h4 text-weight-bold">{{ userNome }}</div>
            <div class="text-subtitle1 text-grey-7">{{ userEmail }}</div>
            <div class="text-caption text-grey-7">{{ userTelefone || 'Telefone não informado' }}</div>

            <div class="row justify-center items-center q-mt-sm">
              <q-rating v-model="userInfo.avaliacao" size="1.5em" :max="5" color="accent" readonly />
              <span class="text-caption q-ml-sm">({{ userInfo.total_avaliacoes || 0 }} avaliações)</span>
            </div>
          </div>

          <!-- Estatísticas em Cards -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h4 text-primary">{{ userInfo.sessoes_realizadas || 0 }}</div>
                  <div class="text-caption">Sessões</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h4 text-secondary">{{ userInfo.estudantes_atendidos || 0 }}</div>
                  <div class="text-caption">Alunos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h4 text-accent">{{ meusConteudos.length }}</div>
                  <div class="text-caption">Conteúdos</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Informações do Perfil -->
          <q-list bordered separator class="q-mb-lg">
            <q-item>
              <q-item-section avatar>
                <q-icon name="school" color="primary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Especialidades</q-item-label>
                <q-item-label caption>{{ userInfo.materias?.join(', ') || 'Não definido' }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="attach_money" color="positive" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Preço médio</q-item-label>
                <q-item-label caption>{{ formatarPreco(userInfo.preco_medio) }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="trending_up" color="accent" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Taxa de aceitação</q-item-label>
                <q-item-label caption>{{ userInfo.taxa_aceitacao || 0 }}%</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section avatar>
                <q-icon name="schedule" color="secondary" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Membro desde</q-item-label>
                <q-item-label caption>{{ formatarData(user.value?.created_at) }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Menu do Perfil -->
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

            <q-item clickable v-ripple @click="verEstatisticas">
              <q-item-section avatar>
                <q-icon name="analytics" color="accent" />
              </q-item-section>
              <q-item-section>Estatísticas Detalhadas</q-item-section>
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
              <q-item-section class="text-negative">Sair da conta</q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </template>
    </q-page-container>

    <!-- FAB para Ações Rápidas -->
    <q-page-sticky position="bottom-right" :offset="[18, 80]">
      <q-btn
        fab
        icon="more_horiz"
        color="primary"
        @click="fabMenu = !fabMenu"
        class="q-elevation-4"
      >
        <q-menu
          v-model="fabMenu"
          anchor="top right"
          self="bottom right"
          :offset="[0, -8]"
        >
          <q-list style="min-width: 200px">
            <q-item clickable v-close-popup @click="publicarConteudoDialog = true">
              <q-item-section avatar>
                <q-icon name="upload" color="primary" />
              </q-item-section>
              <q-item-section>Publicar conteúdo</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="verExtrato">
              <q-item-section avatar>
                <q-icon name="account_balance_wallet" color="secondary" />
              </q-item-section>
              <q-item-section>Ver extrato</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-page-sticky>

    <!-- ==================== MODAIS ==================== -->

    <!-- Modal de Erro -->
    <q-dialog v-model="erroDialog" full-width>
      <q-card>
        <q-card-section class="bg-negative text-white">
          <div class="text-h6">Erro</div>
        </q-card-section>
        <q-card-section>
          <p class="text-body1">{{ erroMensagem }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Negociação -->
    <q-dialog v-model="negociacaoDialog" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Fazer Contraproposta</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Pedido: {{ pedidoNegociacao?.titulo || 'Pedido' }}</div>
          
          <div class="row items-center justify-between q-mb-md bg-grey-2 q-pa-md rounded-borders">
            <span class="text-grey-7">Valor oferecido:</span>
            <span class="text-weight-bold text-h6">{{ formatarPreco(pedidoNegociacao?.preco) }}</span>
          </div>

          <q-input
            v-model="proposta.valor"
            label="Sua proposta (MZN)"
            type="number"
            outlined
            class="q-mb-md"
            :min="50"
          />

          <q-input
            v-model="proposta.mensagem"
            label="Mensagem para o estudante"
            type="textarea"
            outlined
            rows="4"
            class="q-mb-md"
            placeholder="Explique por que este valor é justo..."
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn 
            color="primary" 
            label="Enviar proposta" 
            @click="enviarProposta" 
            :loading="propostaEnviando"
            :disable="!proposta.valor || proposta.valor <= 0"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Chat -->
    <q-dialog v-model="chatDialog" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="row items-center justify-between">
            <div class="row items-center">
              <q-avatar size="32px" class="q-mr-sm">
                <img :src="chatDestinatario.avatar">
              </q-avatar>
              <div>
                <div class="text-subtitle2">{{ chatDestinatario.nome }}</div>
                <div class="text-caption">Online</div>
              </div>
            </div>
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </q-card-section>

        <q-card-section class="scroll bg-grey-2" style="height: 60vh;">
          <div v-for="msg in mensagensChat" :key="msg.id" class="q-mb-sm">
            <div :class="msg.tipo === 'enviada' ? 'text-right' : 'text-left'">
              <q-chip
                :color="msg.tipo === 'enviada' ? 'primary' : 'white'"
                :text-color="msg.tipo === 'enviada' ? 'white' : 'black'"
                class="q-pa-sm"
                style="max-width: 80%;"
              >
                {{ msg.texto }}
              </q-chip>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ msg.hora }}
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-sm">
          <div class="row items-center">
            <q-input
              v-model="novaMensagem"
              outlined
              dense
              placeholder="Digite sua mensagem..."
              class="col"
              @keyup.enter="enviarMensagem"
            >
              <template v-slot:append>
                <q-btn flat round icon="send" color="primary" @click="enviarMensagem" />
              </template>
            </q-input>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal Agendamento -->
    <q-dialog v-model="agendamentoDialog" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Agendar Sessão</div>
        </q-card-section>

        <q-card-section>
          <q-date
            v-model="agendamento.data"
            :options="datasDisponiveis"
            class="full-width q-mb-md"
            minimal
          />

          <q-select
            v-model="agendamento.hora"
            :options="horariosDisponiveis"
            label="Horário"
            outlined
            class="q-mb-md"
          />

          <q-select
            v-model="agendamento.duracao"
            :options="['30 min', '45 min', '60 min', '90 min']"
            label="Duração"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="agendamento.observacoes"
            label="Observações (opcional)"
            type="textarea"
            outlined
            rows="2"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn 
            color="primary" 
            label="Confirmar agendamento" 
            @click="confirmarAgendamento" 
            :loading="agendamentoEnviando"
            :disable="!agendamento.data || !agendamento.hora"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Publicar Conteúdo -->
    <q-dialog v-model="publicarConteudoDialog" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Publicar Novo Conteúdo</div>
        </q-card-section>

        <q-card-section class="scroll" style="max-height: 70vh;">
          <q-input
            v-model="novoConteudo.titulo"
            label="Título do conteúdo"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Título é obrigatório']"
          />

          <q-select
            v-model="novoConteudo.materia"
            :options="materiasOptions"
            label="Matéria"
            outlined
            class="q-mb-md"
            :rules="[val => !!val || 'Matéria é obrigatória']"
          />

          <q-select
            v-model="novoConteudo.nivel"
            :options="niveisOptions"
            label="Nível de ensino"
            outlined
            class="q-mb-md"
            multiple
            use-chips
            :rules="[val => val.length > 0 || 'Selecione pelo menos um nível']"
          />

          <q-input
            v-model="novoConteudo.descricao"
            label="Descrição do conteúdo"
            type="textarea"
            outlined
            rows="4"
            class="q-mb-md"
            :rules="[val => !!val || 'Descrição é obrigatória']"
          />

          <q-file
            v-model="novoConteudo.arquivo"
            label="Arquivo (PDF)"
            outlined
            class="q-mb-md"
            accept=".pdf"
            :rules="[val => !!val || 'Arquivo é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>

          <q-input
            v-model="novoConteudo.preco"
            label="Preço (MZN)"
            type="number"
            outlined
            class="q-mb-md"
            :min="20"
            :rules="[val => val >= 20 || 'Preço mínimo é 20 MZN']"
          />

          <q-checkbox v-model="termosConteudo" label="Declaro que este conteúdo é de minha autoria" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn 
            color="primary" 
            label="Publicar conteúdo" 
            @click="publicarConteudo" 
            :loading="publicando" 
            :disable="!podePublicar"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Estatísticas -->
    <q-dialog v-model="estatisticasDialog" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Estatísticas Detalhadas</div>
        </q-card-section>

        <q-card-section>
          <div class="text-center q-mb-lg">
            <div class="text-h4 text-primary">{{ userInfo.sessoes_realizadas || 0 }}</div>
            <div class="text-caption">Total de sessões</div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-6">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5 text-secondary">{{ userInfo.estudantes_atendidos || 0 }}</div>
                  <div class="text-caption">Estudantes únicos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5 text-accent">{{ meusConteudos.length }}</div>
                  <div class="text-caption">Conteúdos</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5 text-positive">{{ userInfo.taxa_aceitacao || 0 }}%</div>
                  <div class="text-caption">Taxa de aceitação</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card flat bordered>
                <q-card-section class="text-center">
                  <div class="text-h5 text-warning">{{ userInfo.preco_medio || 0 }} MZN</div>
                  <div class="text-caption">Preço médio</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal Saque -->
    <q-dialog v-model="saqueDialog" full-width>
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Solicitar Saque</div>
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle2 q-mb-md">Saldo disponível: {{ formatarPreco(saldo) }}</div>

          <q-input
            v-model="saque.valor"
            label="Valor (MZN)"
            type="number"
            outlined
            class="q-mb-md"
            :min="100"
            :max="saldo"
          />

          <q-select
            v-model="saque.carteira"
            :options="['M-Pesa', 'mKESh', 'E-Mola']"
            label="Carteira"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="saque.numero"
            label="Número da carteira"
            outlined
            class="q-mb-md"
            mask="## ### ####"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn 
            color="primary" 
            label="Solicitar" 
            @click="confirmarSaque" 
            :loading="saqueEnviando"
            :disable="!podeSacar"
          />
        </q-card-actions>
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
  name: 'ExplicadorPage',

  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const loading = ref(true)
    const error = ref(null)
    const tab = ref('disponiveis')
    const fabMenu = ref(false)

    // Diálogos
    const erroDialog = ref(false)
    const erroMensagem = ref('')
    const negociacaoDialog = ref(false)
    const chatDialog = ref(false)
    const agendamentoDialog = ref(false)
    const publicarConteudoDialog = ref(false)
    const estatisticasDialog = ref(false)
    const saqueDialog = ref(false)

    // Loading states
    const propostaEnviando = ref(false)
    const agendamentoEnviando = ref(false)
    const publicando = ref(false)
    const saqueEnviando = ref(false)

    // Dados do usuário
    const user = ref({})
    const userInfo = ref({
      avaliacao: 0,
      total_avaliacoes: 0,
      sessoes_realizadas: 0,
      estudantes_atendidos: 0,
      materias: [],
      preco_medio: 0,
      taxa_aceitacao: 0
    })
    const saldo = ref(0)
    const notificacoesNaoLidas = ref(0)

    // Computed do usuário
    const userNome = computed(() => user.value?.nome || 'Explicador')
    const userEmail = computed(() => user.value?.email || '')
    const userTelefone = computed(() => user.value?.telefone || '')
    const userAvatar = computed(() => user.value?.avatar || 'https://cdn.quasar.dev/img/avatar3.jpg')
    const userMaterias = computed(() => {
      const materias = userInfo.value?.materias || []
      return Array.isArray(materias) && materias.length > 0 ? materias.join(' • ') : 'Explicador'
    })

    // Stats
    const stats = ref({
      pedidosHoje: 0,
      pedidosSemana: 0,
      taxaAceitacao: 0
    })

    // Filtros
    const filtroDisponivel = ref('todos')
    const filtrosDisponiveis = [
      { label: 'Todos', value: 'todos' },
      { label: 'Matemática', value: 'Matemática' },
      { label: 'Física', value: 'Física' },
      { label: 'Química', value: 'Química' },
      { label: 'Português', value: 'Português' },
      { label: 'Urgentes', value: 'urgentes' }
    ]
    const buscaDisponiveis = ref('')
    const filtroConteudos = ref('todos')

    // Dados principais
    const pedidosDisponiveis = ref([])
    const minhasPropostas = ref([])
    const pedidosAtivos = ref([])
    const pedidosConcluidos = ref([])
    const meusConteudos = ref([])

    // Computed - Pedidos filtrados
    const pedidosDisponiveisFiltrados = computed(() => {
      const lista = pedidosDisponiveis.value || []
      if (lista.length === 0) return []
      
      let result = [...lista]

      if (buscaDisponiveis.value) {
        const termo = buscaDisponiveis.value.toLowerCase()
        result = result.filter(p =>
          (p.titulo?.toLowerCase() || '').includes(termo) ||
          (p.materia?.toLowerCase() || '').includes(termo)
        )
      }

      if (filtroDisponivel.value === 'urgentes') {
        result = result.filter(p => p.urgente === true)
      } else if (filtroDisponivel.value !== 'todos') {
        result = result.filter(p => p.materia === filtroDisponivel.value)
      }

      return result
    })

    // Computed - Conteúdos filtrados
    const meusConteudosFiltrados = computed(() => {
      const lista = meusConteudos.value || []
      if (lista.length === 0) return []

      let result = [...lista]

      if (filtroConteudos.value === 'ativos') {
        result = result.filter(c => c.status === 'Ativo')
      } else if (filtroConteudos.value === 'top') {
        result = [...result].sort((a, b) => (b.vendas_count || 0) - (a.vendas_count || 0))
      }

      return result
    })

    const totalVendas = computed(() => {
      return meusConteudos.value.reduce((acc, c) => acc + (c.vendas_count || 0), 0)
    })

    const totalReceita = computed(() => {
      return meusConteudos.value.reduce((acc, c) => acc + (c.preco * (c.vendas_count || 0)), 0)
    })

    // Dados dos modais
    const pedidoNegociacao = ref(null)
    const chatDestinatario = ref({ nome: '', avatar: '' })
    const novaMensagem = ref('')
    const mensagensChat = ref([])
    const termosConteudo = ref(false)

    const proposta = reactive({
      valor: 0,
      mensagem: ''
    })

    const agendamento = reactive({
      data: '',
      hora: '',
      duracao: '60 min',
      observacoes: ''
    })

    const novoConteudo = reactive({
      titulo: '',
      materia: '',
      nivel: [],
      descricao: '',
      arquivo: null,
      preco: 75
    })

    const saque = reactive({
      valor: 100,
      carteira: 'M-Pesa',
      numero: ''
    })

    // Options
    const materiasOptions = ['Matemática', 'Física', 'Química', 'Português', 'Biologia', 'História', 'Geografia']
    const niveisOptions = ['8ª Classe', '9ª Classe', '10ª Classe', '11ª Classe', '12ª Classe', 'Ensino Superior']
    const horariosDisponiveis = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00']
    
    const datasDisponiveis = computed(() => {
      const hoje = new Date()
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hoje)
        d.setDate(hoje.getDate() + i)
        return d.toISOString().split('T')[0].replace(/-/g, '/')
      })
    })

    const podePublicar = computed(() => {
      return novoConteudo.titulo &&
             novoConteudo.materia &&
             novoConteudo.nivel.length > 0 &&
             novoConteudo.descricao &&
             novoConteudo.arquivo &&
             novoConteudo.preco >= 20 &&
             termosConteudo.value
    })

    const podeSacar = computed(() => {
      return saque.valor >= 100 && saque.valor <= saldo.value && saque.carteira && saque.numero
    })

    // ===== CARREGAR DADOS =====
    const carregarDados = async () => {
      loading.value = true
      error.value = null

      try {
        if (!Api.AuthService.isAuthenticated()) {
          router.push('/login')
          return
        }

        const userFromStorage = Api.AuthService.getUser()
        if (userFromStorage) {
          user.value = userFromStorage
        }

        await Promise.allSettled([
          carregarPerfil(),
          carregarPedidosDisponiveis(),
          carregarMinhasPropostas(),
          carregarMeusPedidos(),
          carregarMeusConteudos(),
          carregarGanhos()
        ])
        
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        error.value = 'Não foi possível carregar os dados'
      } finally {
        loading.value = false
      }
    }

    const carregarPerfil = async () => {
      try {
        const data = await Api.AuthService.getCurrentUser()
        user.value = data
        userInfo.value = data.explicador || userInfo.value
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
      }
    }

    const carregarPedidosDisponiveis = async () => {
      try {
        const data = await Api.ExplicadorService.getPedidosDisponiveis()
        pedidosDisponiveis.value = data.pedidos?.data || data.pedidos || []
        stats.value = {
          pedidosHoje: data.stats?.hoje || 0,
          pedidosSemana: data.stats?.semana || 0,
          taxaAceitacao: data.stats?.taxa_aceitacao || 0
        }
      } catch (err) {
        console.error('Erro ao carregar pedidos disponíveis:', err)
        pedidosDisponiveis.value = []
      }
    }

    const carregarMinhasPropostas = async () => {
      try {
        const data = await Api.ExplicadorService.getMinhasPropostas()
        minhasPropostas.value = data.propostas || []
      } catch (err) {
        console.error('Erro ao carregar propostas:', err)
        minhasPropostas.value = []
      }
    }

    const carregarMeusPedidos = async () => {
      try {
        const data = await Api.ExplicadorService.getMeusPedidos()
        const todosPedidos = data.pedidos?.data || data.pedidos || []
        
        pedidosAtivos.value = todosPedidos.filter(p => 
          ['Aceito', 'Em andamento'].includes(p?.status)
        )
        pedidosConcluidos.value = todosPedidos.filter(p => 
          p?.status === 'Concluído'
        )

      } catch (err) {
        console.error('Erro ao carregar meus pedidos:', err)
        pedidosAtivos.value = []
        pedidosConcluidos.value = []
      }
    }

    const carregarMeusConteudos = async () => {
      try {
        const data = await Api.ExplicadorService.getMeusConteudos()
        meusConteudos.value = data.conteudos || []
      } catch (err) {
        console.error('Erro ao carregar meus conteúdos:', err)
        meusConteudos.value = []
      }
    }

    const carregarGanhos = async () => {
      try {
        const data = await Api.ExplicadorService.getGanhos()
        saldo.value = data.saldo || 0
      } catch (err) {
        console.error('Erro ao carregar ganhos:', err)
        saldo.value = 0
      }
    }

    // ===== AÇÕES DOS PEDIDOS =====
    const aceitarPedido = async (pedido) => {
      if (!pedido || !pedido.id) {
        mostrarErro('Pedido inválido')
        return
      }
      
      $q.dialog({
        title: 'Confirmar',
        message: `Deseja aceitar o pedido "${pedido.titulo}" por ${formatarPreco(pedido.preco)}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await Api.ExplicadorService.aceitarPedido(pedido.id)
          await Promise.all([
            carregarPedidosDisponiveis(), 
            carregarMeusPedidos()
          ])
          tab.value = 'ativos'
        } catch (err) {
          console.error('Erro ao aceitar pedido:', err)
          mostrarErro('Não foi possível aceitar o pedido')
        }
      })
    }

    const recusarPedido = (pedido) => {
      if (!pedido || !pedido.id) {
        mostrarErro('Pedido inválido')
        return
      }
      
      $q.dialog({
        title: 'Confirmar',
        message: 'Deseja recusar este pedido?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          // Implementar endpoint de recusa se necessário
          await carregarPedidosDisponiveis()
        } catch (err) {
          console.error('Erro ao recusar pedido:', err)
        }
      })
    }

    const abrirNegociacao = (pedido) => {
      if (!pedido) return
      pedidoNegociacao.value = pedido
      proposta.valor = pedido.preco + 100
      proposta.mensagem = ''
      negociacaoDialog.value = true
    }

    const enviarProposta = async () => {
      if (!proposta.valor || proposta.valor <= 0) {
        mostrarErro('Defina um valor válido')
        return
      }

      if (!pedidoNegociacao.value?.id) {
        mostrarErro('Pedido não identificado')
        return
      }

      propostaEnviando.value = true
      try {
        await Api.ExplicadorService.fazerProposta(pedidoNegociacao.value.id, {
          valor: proposta.valor,
          mensagem: proposta.mensagem
        })

        negociacaoDialog.value = false
        await Promise.all([
          carregarPedidosDisponiveis(),
          carregarMinhasPropostas()
        ])
        tab.value = 'propostas'
      } catch (err) {
        console.error('Erro ao enviar proposta:', err)
        mostrarErro('Não foi possível enviar a proposta')
      } finally {
        propostaEnviando.value = false
      }
    }

    const cancelarProposta = async (proposta) => {
      if (!proposta || !proposta.id) return
      
      $q.dialog({
        title: 'Confirmar',
        message: 'Deseja cancelar esta proposta?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await Api.ExplicadorService.cancelarProposta(proposta.id)
          await carregarMinhasPropostas()
        } catch (err) {
          console.error('Erro ao cancelar proposta:', err)
          mostrarErro('Não foi possível cancelar a proposta')
        }
      })
    }

    const iniciarSessao = async (pedido) => {
      if (!pedido || !pedido.id) return
      
      $q.dialog({
        title: 'Iniciar Sessão',
        message: `Escolha a plataforma:`,
        options: {
          type: 'radio',
          model: 'zoom',
          items: [
            { label: 'Zoom', value: 'zoom' },
            { label: 'Google Meet', value: 'meet' },
            { label: 'WhatsApp', value: 'whatsapp' }
          ]
        },
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await Api.ExplicadorService.iniciarSessao(pedido.id)
          await carregarMeusPedidos()
        } catch (err) {
          console.error('Erro ao iniciar sessão:', err)
          mostrarErro('Não foi possível iniciar a sessão')
        }
      })
    }

    const concluirPedido = async (pedido) => {
      if (!pedido || !pedido.id) return
      
      $q.dialog({
        title: 'Confirmar',
        message: 'Deseja marcar como concluído?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await Api.ExplicadorService.concluirPedido(pedido.id)
          await Promise.all([carregarMeusPedidos(), carregarGanhos()])
          tab.value = 'concluidos'
        } catch (err) {
          console.error('Erro ao concluir pedido:', err)
          mostrarErro('Não foi possível concluir o pedido')
        }
      })
    }

    const abrirAgendamento = (pedido) => {
      if (!pedido) return
      pedidoNegociacao.value = pedido
      agendamento.data = ''
      agendamento.hora = ''
      agendamentoDialog.value = true
    }

    const confirmarAgendamento = async () => {
      if (!agendamento.data || !agendamento.hora) {
        mostrarErro('Selecione data e horário')
        return
      }

      if (!pedidoNegociacao.value?.id) {
        mostrarErro('Pedido não identificado')
        return
      }

      agendamentoEnviando.value = true
      try {
        await Api.ExplicadorService.agendarSessao(pedidoNegociacao.value.id, {
          data: agendamento.data,
          hora: agendamento.hora,
          duracao: agendamento.duracao,
          observacoes: agendamento.observacoes,
          plataforma: 'Zoom'
        })

        agendamentoDialog.value = false
        await carregarMeusPedidos()
      } catch (err) {
        console.error('Erro ao agendar:', err)
        mostrarErro('Não foi possível agendar a sessão')
      } finally {
        agendamentoEnviando.value = false
      }
    }

    // ===== AÇÕES DE CONTEÚDO =====
    const prepararPublicacao = (pedido) => {
      if (!pedido) return
      
      novoConteudo.titulo = `Solução: ${pedido.titulo || 'Pedido'}`
      novoConteudo.materia = pedido.materia || 'Matemática'
      novoConteudo.descricao = `Material baseado na sessão com ${pedido.estudante?.nome || 'estudante'}.`
      publicarConteudoDialog.value = true
    }

    const publicarConteudo = async () => {
      if (!podePublicar.value) return

      publicando.value = true
      try {
        const formData = new FormData()
        Object.keys(novoConteudo).forEach(key => {
          if (key === 'nivel') {
            formData.append(key, JSON.stringify(novoConteudo[key] || []))
          } else if (novoConteudo[key]) {
            formData.append(key, novoConteudo[key])
          }
        })

        await Api.ExplicadorService.publicarConteudo(formData)

        publicarConteudoDialog.value = false
        await carregarMeusConteudos()
        
        Object.assign(novoConteudo, {
          titulo: '', materia: '', nivel: [], descricao: '', arquivo: null, preco: 75
        })
        termosConteudo.value = false
      } catch (err) {
        console.error('Erro ao publicar:', err)
        mostrarErro('Não foi possível publicar o conteúdo')
      } finally {
        publicando.value = false
      }
    }

    const editarConteudo = (conteudo) => {
      if (!conteudo) return
      
      $q.dialog({
        title: 'Editar Conteúdo',
        prompt: {
          model: conteudo.preco,
          type: 'number',
          label: 'Novo preço (MZN)'
        },
        cancel: true,
        persistent: true
      }).onOk(async (novoPreco) => {
        try {
          await Api.ExplicadorService.editarConteudo(conteudo.id, { preco: novoPreco })
          conteudo.preco = novoPreco
        } catch (err) {
          console.error('Erro ao editar:', err)
          mostrarErro('Não foi possível editar o conteúdo')
        }
      })
    }

    const toggleConteudoStatus = async (conteudo) => {
      if (!conteudo) return
      
      try {
        await Api.ExplicadorService.toggleConteudoStatus(conteudo.id)
        conteudo.status = conteudo.status === 'Ativo' ? 'Inativo' : 'Ativo'
      } catch (err) {
        console.error('Erro ao alterar status:', err)
        mostrarErro('Não foi possível alterar o status')
      }
    }

    // ===== AÇÕES DE GANHOS =====
    const verExtrato = async () => {
      try {
        const data = await Api.ExplicadorService.getGanhos()
        const transacoes = data.historico?.data || []

        $q.dialog({
          title: 'Extrato de Saldo',
          message: `
            <div class="text-center q-mb-md">
              <div class="text-h4 text-primary">${formatarPreco(saldo.value)}</div>
              <div class="text-caption">Saldo disponível</div>
            </div>
            <div class="text-weight-bold q-mb-sm">Últimas movimentações:</div>
            ${transacoes.slice(0, 5).map(t => `
              <div class="row justify-between q-mb-xs">
                <span class="text-caption">${t.descricao || 'Transação'}</span>
                <span class="text-caption ${t.tipo === 'entrada' ? 'text-positive' : 'text-negative'}">
                  ${t.tipo === 'entrada' ? '+' : '-'} ${formatarPreco(Math.abs(t.valor || 0))}
                </span>
              </div>
            `).join('')}
          `,
          html: true,
          persistent: true
        })
      } catch (err) {
        console.error('Erro ao carregar extrato:', err)
        mostrarErro('Não foi possível carregar o extrato')
      }
    }

    const solicitarSaque = () => {
      if (saldo.value < 100) {
        mostrarErro('Saldo mínimo para saque: 100 MZN')
        return
      }
      saque.valor = Math.min(1000, saldo.value)
      saque.carteira = 'M-Pesa'
      saque.numero = ''
      saqueDialog.value = true
    }

    const confirmarSaque = async () => {
      if (!podeSacar.value) return

      saqueEnviando.value = true
      try {
        await Api.ExplicadorService.solicitarSaque({
          valor: saque.valor,
          carteira: saque.carteira,
          numero: saque.numero
        })

        saqueDialog.value = false
        await carregarGanhos()
      } catch (err) {
        console.error('Erro ao solicitar saque:', err)
        mostrarErro('Não foi possível solicitar o saque')
      } finally {
        saqueEnviando.value = false
      }
    }

    // ===== OUTRAS AÇÕES =====
    const abrirChat = (estudante) => {
      if (!estudante) return
      
      chatDestinatario.value = {
        nome: estudante.nome || 'Estudante',
        avatar: estudante.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'
      }
      chatDialog.value = true
      mensagensChat.value = []
    }

    const enviarMensagem = () => {
      if (novaMensagem.value.trim()) {
        mensagensChat.value.push({
          id: Date.now(),
          tipo: 'enviada',
          texto: novaMensagem.value,
          hora: new Date().toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })
        })
        novaMensagem.value = ''
      }
    }

    const abrirNotificacoes = () => {
      $q.dialog({
        title: 'Notificações',
        message: 'Você não tem notificações no momento',
        persistent: true
      })
    }

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
        } catch (err) {
          console.error('Erro ao editar perfil:', err)
          mostrarErro('Não foi possível atualizar o perfil')
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

    const verEstatisticas = () => {
      estatisticasDialog.value = true
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

    const logout = () => {
      $q.dialog({
        title: 'Sair',
        message: 'Deseja realmente sair?',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await Api.AuthService.logout()
          router.push('/login')
        } catch (err) {
          router.push('/login')
        }
      })
    }

    const mostrarErro = (mensagem) => {
      erroMensagem.value = mensagem
      erroDialog.value = true
    }

    // ===== UTILITÁRIOS =====
    const formatarPreco = (valor) => {
      if (valor === null || valor === undefined) return '0 MZN'
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 0
      }).format(valor)
    }

    const formatarData = (data) => {
      if (!data) return 'Data desconhecida'
      return new Date(data).toLocaleDateString('pt-MZ')
    }

    const formatarDataHora = (data) => {
      if (!data) return 'Data desconhecida'
      return new Date(data).toLocaleString('pt-MZ')
    }

    const timeAgo = (data) => {
      if (!data) return 'há pouco'
      const segundos = Math.floor((new Date() - new Date(data)) / 1000)
      if (segundos < 60) return 'agora'
      const minutos = Math.floor(segundos / 60)
      if (minutos < 60) return `há ${minutos} min`
      const horas = Math.floor(minutos / 60)
      if (horas < 24) return `há ${horas} h`
      const dias = Math.floor(horas / 24)
      return `há ${dias} d`
    }

    const truncate = (text, length) => {
      if (!text) return ''
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    }

    onMounted(() => {
      carregarDados()
    })

    return {
      // Estado
      loading,
      error,
      tab,
      fabMenu,
      user,
      userNome,
      userEmail,
      userTelefone,
      userAvatar,
      userMaterias,
      userInfo,
      saldo,
      notificacoesNaoLidas,
      stats,

      // Filtros
      filtroDisponivel,
      filtrosDisponiveis,
      buscaDisponiveis,
      filtroConteudos,

      // Dados
      pedidosDisponiveis,
      minhasPropostas,
      pedidosAtivos,
      pedidosConcluidos,
      meusConteudos,
      pedidosDisponiveisFiltrados,
      meusConteudosFiltrados,
      totalVendas,
      totalReceita,

      // Modais
      erroDialog,
      erroMensagem,
      negociacaoDialog,
      chatDialog,
      agendamentoDialog,
      publicarConteudoDialog,
      estatisticasDialog,
      saqueDialog,

      // Loading states
      propostaEnviando,
      agendamentoEnviando,
      publicando,
      saqueEnviando,

      // Dados dos modais
      pedidoNegociacao,
      chatDestinatario,
      novaMensagem,
      mensagensChat,
      termosConteudo,
      proposta,
      agendamento,
      novoConteudo,
      saque,
      podePublicar,
      podeSacar,

      // Options
      materiasOptions,
      niveisOptions,
      horariosDisponiveis,
      datasDisponiveis,

      // Métodos
      carregarDados,
      aceitarPedido,
      recusarPedido,
      abrirNegociacao,
      enviarProposta,
      cancelarProposta,
      iniciarSessao,
      concluirPedido,
      abrirChat,
      abrirAgendamento,
      confirmarAgendamento,
      prepararPublicacao,
      publicarConteudo,
      editarConteudo,
      toggleConteudoStatus,
      verExtrato,
      solicitarSaque,
      confirmarSaque,
      abrirNotificacoes,
      editarPerfil,
      verMetodosPagamento,
      verEstatisticas,
      configuracoes,
      ajuda,
      logout,
      enviarMensagem,
      mostrarErro,

      // Utilitários
      formatarPreco,
      formatarData,
      formatarDataHora,
      timeAgo,
      truncate
    }
  }
}
</script>

<style scoped>
.loading-container,
.error-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 20px;
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 0;
}

.filter-chip {
  border-radius: 20px;
  font-size: 13px;
  margin: 2px;
}

.pedido-card,
.conteudo-card {
  border-radius: 16px;
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.pedido-card:hover,
.conteudo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bg-positive-light {
  background-color: #e8f5e9;
}

.bg-warning-light {
  background-color: #fff3e0;
}

.bg-info-light {
  background-color: #e1f5fe;
}

.tab-label {
  font-size: 11px;
  margin-top: 2px;
}

.lines-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

@media (max-width: 599px) {
  .pedido-card,
  .conteudo-card {
    border-radius: 12px;
  }
  
  .filters-container {
    gap: 4px;
  }
  
  .filter-chip {
    font-size: 12px;
    padding: 0 8px;
  }
  
  .tab-label {
    font-size: 10px;
  }
}
</style>