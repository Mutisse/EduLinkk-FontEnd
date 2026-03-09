<template>
  <div class="admin-page">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-content">
        <div class="user-info" @click="toggleUserMenu">
          <div class="avatar">
            <img 
              :src="userAvatar" 
              @error="$event.target.src = 'https://cdn.quasar.dev/img/avatar6.jpg'"
            >
          </div>
          <div class="info">
            <div class="name">{{ userNome }}</div>
            <div class="role">Painel de Controle</div>
          </div>
          <span class="material-icons dropdown-icon">arrow_drop_down</span>
        </div>
        
        <!-- Menu dropdown do usuário -->
        <div v-if="userMenuOpen" class="user-dropdown">
          <div class="dropdown-header">
            <span class="material-icons">account_circle</span>
            <div>
              <div class="user-name">{{ userNome }}</div>
              <div class="user-email">{{ userEmail }}</div>
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" @click="irParaPerfil">
            <span class="material-icons">person</span>
            Meu Perfil
          </button>
          <button class="dropdown-item" @click="irParaConfiguracoes">
            <span class="material-icons">settings</span>
            Configurações
          </button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout" @click="logout">
            <span class="material-icons">exit_to_app</span>
            Sair
          </button>
        </div>

        <button class="notification-btn" @click="abrirNotificacoes">
          <span class="material-icons">notifications_none</span>
          <span v-if="notificacoesNaoLidas > 0" class="badge">{{ notificacoesNaoLidas }}</span>
        </button>
      </div>
    </header>

    <!-- Navegação inferior -->
    <nav class="bottom-nav">
      <button
        v-for="item in menuItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: tab === item.id }"
        @click="tab = item.id"
      >
        <span class="material-icons">{{ item.icon }}</span>
        <span class="label">{{ item.label }}</span>
        <span v-if="item.badge > 0" class="nav-badge">{{ item.badge }}</span>
      </button>
    </nav>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Carregando...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <span class="material-icons error-icon">error_outline</span>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="carregarDados">Tentar novamente</button>
    </div>

    <!-- Conteúdo -->
    <main v-else class="main-content">
      <!-- DASHBOARD -->
      <div v-if="tab === 'dashboard'" class="dashboard">
        <!-- Stats rápidos -->
        <div class="stats-row">
          <div class="stat-box" @click="tab = 'usuarios'">
            <div class="stat-value">{{ stats.usuarios?.total || 0 }}</div>
            <div class="stat-label">Usuários</div>
            <div class="stat-trend positive" v-if="stats.usuarios?.novos_hoje > 0">
              +{{ stats.usuarios.novos_hoje }} hoje
            </div>
          </div>
          <div class="stat-box" @click="tab = 'explicadores'">
            <div class="stat-value">{{ stats.explicadores?.total || 0 }}</div>
            <div class="stat-label">Explicadores</div>
            <div class="stat-trend" :class="stats.explicadores?.pendentes > 0 ? 'warning' : ''">
              {{ stats.explicadores?.pendentes || 0 }} pendentes
            </div>
          </div>
          <div class="stat-box" @click="tab = 'conteudos'">
            <div class="stat-value">{{ stats.conteudos?.total || 0 }}</div>
            <div class="stat-label">Conteúdos</div>
            <div class="stat-trend warning" v-if="stats.conteudos?.pendentes > 0">
              {{ stats.conteudos.pendentes }} pendentes
            </div>
          </div>
          <div class="stat-box" @click="tab = 'transacoes'">
            <div class="stat-value">{{ formatarPreco(stats.financeiro?.receita_mes || 0) }}</div>
            <div class="stat-label">Receita/mês</div>
          </div>
        </div>

        <!-- LISTA 1: Atividade Recente -->
        <div class="list-card">
          <div class="list-header">
            <h3>📋 Atividade Recente</h3>
            <button class="view-all" @click="tab = 'usuarios'">Ver todos</button>
          </div>
          <div class="list-items">
            <div v-if="atividades.length === 0" class="empty-item">
              Nenhuma atividade recente
            </div>
            <div v-for="item in atividades" :key="item.id" class="list-item">
              <div class="item-icon" :style="{ background: item.cor + '20', color: item.cor }">
                <span class="material-icons">{{ item.icon }}</span>
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.titulo }}</div>
                <div class="item-subtitle">{{ item.descricao }}</div>
              </div>
              <div class="item-time">{{ item.tempo }}</div>
            </div>
          </div>
        </div>

        <!-- LISTA 2: Top Explicadores -->
        <div class="list-card">
          <div class="list-header">
            <h3>🏆 Top Explicadores</h3>
            <button class="view-all" @click="tab = 'explicadores'">Ver todos</button>
          </div>
          <div class="list-items">
            <div v-if="topExplicadores.length === 0" class="empty-item">
              Nenhum explicador encontrado
            </div>
            <div v-for="exp in topExplicadores" :key="exp.id" class="list-item">
              <div class="item-avatar">
                <img :src="exp.avatar" :alt="exp.nome">
              </div>
              <div class="item-info">
                <div class="item-title">{{ exp.nome }}</div>
                <div class="item-subtitle">{{ exp.materias?.join(' • ') || 'Explicador' }}</div>
              </div>
              <div class="item-stats">
                <span class="stat-badge">{{ exp.sessoes || 0 }} sessões</span>
                <span class="stat-badge highlight">{{ formatarPreco(exp.ganhos || 0) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- LISTA 3: Últimos Usuários -->
        <div class="list-card">
          <div class="list-header">
            <h3>👥 Últimos Usuários</h3>
            <button class="view-all" @click="tab = 'usuarios'">Ver todos</button>
          </div>
          <div class="list-items">
            <div v-if="ultimosUsuarios.length === 0" class="empty-item">
              Nenhum usuário recente
            </div>
            <div v-for="user in ultimosUsuarios" :key="user.id" class="list-item">
              <div class="item-avatar">
                <img :src="user.avatar" :alt="user.nome">
              </div>
              <div class="item-info">
                <div class="item-title">{{ user.nome }}</div>
                <div class="item-subtitle">
                  <span class="tag" :class="user.tipo?.toLowerCase()">{{ user.tipo || 'Usuário' }}</span>
                </div>
              </div>
              <div class="item-time">{{ timeAgo(user.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- LISTA 4: Últimas Transações -->
        <div class="list-card">
          <div class="list-header">
            <h3>💰 Últimas Transações</h3>
            <button class="view-all" @click="tab = 'transacoes'">Ver todos</button>
          </div>
          <div class="list-items">
            <div v-if="ultimasTransacoes.length === 0" class="empty-item">
              Nenhuma transação recente
            </div>
            <div v-for="trans in ultimasTransacoes" :key="trans.id" class="list-item">
              <div class="item-icon" :class="trans.tipo?.toLowerCase()">3
                <span class="material-icons">{{ trans.tipo === 'Sessão' ? 'record_voice_over' : 'menu_book' }}</span>
              </div>
              <div class="item-info">
                <div class="item-title">
                  {{ trans.id }}
                  <span class="tag" :class="trans.status?.toLowerCase()">{{ trans.status }}</span>
                </div>
                <div class="item-subtitle">{{ trans.estudante_nome || trans.estudante }} → {{ trans.explicador_nome || trans.explicador }}</div>
              </div>
              <div class="item-values">
                <div class="main-value">{{ formatarPreco(trans.valor) }}</div>
                <div class="commission">+{{ formatarPreco(trans.comissao) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- LISTA 5: Feedbacks -->
        <div class="list-card">
          <div class="list-header">
            <h3>💬 Feedbacks</h3>
            <button class="view-all" @click="carregarFeedbacks">Ver todos</button>
          </div>
          <div class="list-items">
            <div v-if="feedbacks.length === 0" class="empty-item">
              Nenhum feedback pendente
            </div>
            <div v-for="fb in feedbacks" :key="fb.id" class="list-item">
              <div class="item-avatar">
                <img :src="fb.user?.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'" :alt="fb.user?.nome">
              </div>
              <div class="item-info">
                <div class="item-title">
                  {{ fb.user?.nome || 'Usuário' }}
                  <span class="tag" :class="fb.tipo?.toLowerCase()">{{ fb.tipo }}</span>
                </div>
                <div class="item-subtitle">{{ truncate(fb.texto, 50) }}</div>
              </div>
              <div class="item-time">{{ timeAgo(fb.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- WhatsApp Channel -->
        <div class="whatsapp-card">
          <div class="whatsapp-content">
            <div class="whatsapp-icon">
              <span class="material-icons">whatsapp</span>
            </div>
            <div class="whatsapp-text">
              <h4>Canal do Administrador</h4>
              <p>Receba atualizações do sistema</p>
            </div>
          </div>
          <a href="#" class="follow-btn" @click.prevent="seguirCanal">Seguir</a>
        </div>
      </div>

      <!-- USUÁRIOS -->
      <div v-if="tab === 'usuarios'" class="tab-page">
        <div class="tab-header">
          <h2>Usuários</h2>
          <div class="header-actions">
            <input 
              v-model="filtros.usuarios.busca" 
              placeholder="Buscar..." 
              class="search-input"
              @input="filtrarUsuarios"
            >
            <select v-model="filtros.usuarios.tipo" class="filter-select" @change="filtrarUsuarios">
              <option value="">Todos</option>
              <option value="estudante">Estudantes</option>
              <option value="explicador">Explicadores</option>
              <option value="admin">Admins</option>
            </select>
            <select v-model="filtros.usuarios.status" class="filter-select" @change="filtrarUsuarios">
              <option value="">Todos</option>
              <option value="Ativo">Ativos</option>
              <option value="Inativo">Inativos</option>
              <option value="Bloqueado">Bloqueados</option>
              <option value="Pendente">Pendentes</option>
            </select>
          </div>
        </div>

        <div class="list-card">
          <div class="list-items">
            <div v-if="usuariosFiltrados.length === 0" class="empty-item">
              Nenhum usuário encontrado
            </div>
            <div v-for="user in usuariosFiltrados" :key="user.id" class="list-item">
              <div class="item-avatar">
                <img :src="user.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'" :alt="user.nome">
                <span class="status-dot" :class="user.status?.toLowerCase()"></span>
              </div>
              <div class="item-info">
                <div class="item-title">{{ user.nome }}</div>
                <div class="item-subtitle">{{ user.email }}</div>
                <div class="item-tags">
                  <span class="tag" :class="user.tipo?.toLowerCase()">{{ user.tipo }}</span>
                  <span class="tag" :class="user.status?.toLowerCase()">{{ user.status }}</span>
                </div>
              </div>
              <div v-if="user.tipo === 'explicador'" class="item-stats">
                <div>{{ user.explicador?.sessoes_realizadas || 0 }} sessões</div>
                <div class="highlight">{{ formatarPreco(user.explicador?.ganhos_mes || 0) }}/mês</div>
              </div>
              <div class="item-actions">
                <button class="action-btn" @click="verUsuario(user)" title="Ver detalhes">👁️</button>
                <button class="action-btn" @click="editarUsuario(user)" title="Editar">✏️</button>
                <button 
                  class="action-btn" 
                  :class="user.status === 'Bloqueado' ? 'unlock' : 'lock'" 
                  @click="toggleStatusUsuario(user)"
                  :title="user.status === 'Bloqueado' ? 'Desbloquear' : 'Bloquear'"
                >
                  {{ user.status === 'Bloqueado' ? '🔓' : '🔒' }}
                </button>
              </div>
            </div>
          </div>
          <div v-if="paginas.usuarios.totalPages > 1" class="pagination">
            <button 
              v-for="page in paginas.usuarios.totalPages" 
              :key="page"
              class="page-btn"
              :class="{ active: paginas.usuarios.currentPage === page }"
              @click="carregarUsuarios(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <!-- EXPLICADORES -->
      <div v-if="tab === 'explicadores'" class="tab-page">
        <div class="tab-header">
          <h2>Explicadores</h2>
          <div class="header-actions">
            <input 
              v-model="filtros.explicadores.busca" 
              placeholder="Buscar..." 
              class="search-input"
              @input="filtrarExplicadores"
            >
            <select v-model="filtros.explicadores.status" class="filter-select" @change="filtrarExplicadores">
              <option value="">Todos</option>
              <option value="Ativo">Ativos</option>
              <option value="Pendente">Pendentes</option>
              <option value="Inativo">Inativos</option>
            </select>
          </div>
        </div>

        <div class="list-card">
          <div class="list-items">
            <div v-if="explicadoresFiltrados.length === 0" class="empty-item">
              Nenhum explicador encontrado
            </div>
            <div v-for="exp in explicadoresFiltrados" :key="exp.id" class="list-item">
              <div class="item-avatar">
                <img :src="exp.user?.avatar || 'https://cdn.quasar.dev/img/avatar3.jpg'" :alt="exp.user?.nome">
                <span class="status-dot" :class="exp.status?.toLowerCase()"></span>
              </div>
              <div class="item-info">
                <div class="item-title">{{ exp.user?.nome }}</div>
                <div class="item-subtitle">{{ exp.user?.email }}</div>
                <div class="rating">
                  <span v-for="n in 5" :key="n">{{ n <= (exp.avaliacao || 0) ? '★' : '☆' }}</span>
                  <span>({{ exp.total_avaliacoes || 0 }})</span>
                </div>
                <div class="item-tags">
                  <span v-for="mat in exp.materias || []" :key="mat" class="tag secondary">{{ mat }}</span>
                </div>
              </div>
              <div class="item-stats">
                <div>{{ exp.sessoes_realizadas || 0 }} sessões</div>
                <div class="highlight">{{ formatarPreco(exp.ganhos_mes || 0) }}/mês</div>
              </div>
              <div class="item-actions">
                <button v-if="exp.status === 'Pendente'" class="action-btn success" @click="aprovarExplicador(exp)" title="Aprovar">✅</button>
                <button class="action-btn" @click="verExplicador(exp)" title="Ver detalhes">👁️</button>
              </div>
            </div>
          </div>
          <div v-if="paginas.explicadores.totalPages > 1" class="pagination">
            <button 
              v-for="page in paginas.explicadores.totalPages" 
              :key="page"
              class="page-btn"
              :class="{ active: paginas.explicadores.currentPage === page }"
              @click="carregarExplicadores(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <!-- CONTEÚDOS -->
      <div v-if="tab === 'conteudos'" class="tab-page">
        <div class="tab-header">
          <h2>Conteúdos</h2>
          <div class="header-actions">
            <input 
              v-model="filtros.conteudos.busca" 
              placeholder="Buscar..." 
              class="search-input"
              @input="filtrarConteudos"
            >
            <select v-model="filtros.conteudos.status" class="filter-select" @change="filtrarConteudos">
              <option value="">Todos</option>
              <option value="Ativo">Ativos</option>
              <option value="Pendente">Pendentes</option>
              <option value="Inativo">Inativos</option>
            </select>
            <select v-model="filtros.conteudos.materia" class="filter-select" @change="filtrarConteudos">
              <option value="">Todas</option>
              <option value="Matemática">Matemática</option>
              <option value="Física">Física</option>
              <option value="Química">Química</option>
              <option value="Português">Português</option>
            </select>
          </div>
        </div>

        <div class="list-card">
          <div class="list-items">
            <div v-if="conteudosFiltrados.length === 0" class="empty-item">
              Nenhum conteúdo encontrado
            </div>
            <div v-for="item in conteudosFiltrados" :key="item.id" class="list-item">
              <div class="item-icon" :class="item.materia?.toLowerCase()">
                <span class="material-icons">
                  {{ item.materia === 'Matemática' ? 'functions' :
                     item.materia === 'Física' ? 'science' : 'menu_book' }}
                </span>
              </div>
              <div class="item-info">
                <div class="item-title">{{ item.titulo }}</div>
                <div class="item-subtitle">por {{ item.explicador?.nome || item.explicador }}</div>
                <div class="item-tags">
                  <span class="tag" :class="item.materia?.toLowerCase()">{{ item.materia }}</span>
                  <span class="tag" :class="item.status?.toLowerCase()">{{ item.status }}</span>
                </div>
              </div>
              <div class="item-stats">
                <div>{{ item.vendas_count || 0 }} vendas</div>
                <div class="highlight">{{ formatarPreco(item.preco) }}</div>
              </div>
              <div class="item-actions">
                <button v-if="item.status === 'Pendente'" class="action-btn success" @click="aprovarConteudo(item)" title="Aprovar">✅</button>
                <button v-if="item.status === 'Pendente'" class="action-btn danger" @click="reprovarConteudo(item)" title="Reprovar">❌</button>
                <button class="action-btn" @click="editarConteudo(item)" title="Editar preço">✏️</button>
                <button 
                  class="action-btn" 
                  :class="item.status === 'Ativo' ? 'warning' : 'success'" 
                  @click="toggleStatusConteudo(item)"
                  :title="item.status === 'Ativo' ? 'Desativar' : 'Ativar'"
                >
                  {{ item.status === 'Ativo' ? '⏸️' : '▶️' }}
                </button>
              </div>
            </div>
          </div>
          <div v-if="paginas.conteudos.totalPages > 1" class="pagination">
            <button 
              v-for="page in paginas.conteudos.totalPages" 
              :key="page"
              class="page-btn"
              :class="{ active: paginas.conteudos.currentPage === page }"
              @click="carregarConteudos(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <!-- TRANSAÇÕES -->
      <div v-if="tab === 'transacoes'" class="tab-page">
        <div class="tab-header">
          <h2>Transações</h2>
          <div class="header-actions">
            <input 
              v-model="filtros.transacoes.busca" 
              placeholder="Buscar..." 
              class="search-input"
              @input="filtrarTransacoes"
            >
            <select v-model="filtros.transacoes.tipo" class="filter-select" @change="filtrarTransacoes">
              <option value="">Todos</option>
              <option value="Sessão">Sessões</option>
              <option value="Conteúdo">Conteúdos</option>
            </select>
            <select v-model="filtros.transacoes.status" class="filter-select" @change="filtrarTransacoes">
              <option value="">Todos</option>
              <option value="Concluída">Concluídas</option>
              <option value="Pendente">Pendentes</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>
        </div>

        <div class="list-card">
          <div class="list-items">
            <div v-if="transacoesFiltradas.length === 0" class="empty-item">
              Nenhuma transação encontrada
            </div>
            <div v-for="trans in transacoesFiltradas" :key="trans.id" class="list-item">
              <div class="item-icon" :class="trans.tipo?.toLowerCase()">
                <span class="material-icons">{{ trans.tipo === 'Sessão' ? 'record_voice_over' : 'menu_book' }}</span>
              </div>
              <div class="item-info">
                <div class="item-title">
                  {{ trans.id }}
                  <span class="tag" :class="trans.status?.toLowerCase()">{{ trans.status }}</span>
                </div>
                <div class="item-subtitle">{{ trans.estudante_nome || trans.estudante }} → {{ trans.explicador_nome || trans.explicador }}</div>
                <div class="item-date">{{ formatarData(trans.created_at) }}</div>
              </div>
              <div class="item-values">
                <div class="main-value">{{ formatarPreco(trans.valor) }}</div>
                <div class="commission">+{{ formatarPreco(trans.comissao) }}</div>
              </div>
            </div>
          </div>
          <div v-if="paginas.transacoes.totalPages > 1" class="pagination">
            <button 
              v-for="page in paginas.transacoes.totalPages" 
              :key="page"
              class="page-btn"
              :class="{ active: paginas.transacoes.currentPage === page }"
              @click="carregarTransacoes(page)"
            >
              {{ page }}
            </button>
          </div>
        </div>
      </div>

      <!-- PERFIL DO ADMIN -->
      <div v-if="tab === 'perfil'" class="tab-page">
        <div class="profile-header">
          <div class="profile-avatar">
            <img :src="userAvatar" :alt="userNome">
            <div class="status-dot online"></div>
          </div>
          <h2>{{ userNome }}</h2>
          <p class="profile-email">{{ userEmail }}</p>
          <p class="profile-role">Administrador do Sistema</p>
        </div>

        <div class="info-card">
          <div class="info-row">
            <span class="label">Membro desde</span>
            <span class="value">{{ formatarData(user?.created_at) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Último acesso</span>
            <span class="value">{{ formatarDataHora(user?.ultimo_acesso) }}</span>
          </div>
        </div>

        <div class="menu-list">
          <button class="menu-item" @click="editarPerfil">
            <span class="material-icons">edit</span>
            Editar Perfil
          </button>
          <button class="menu-item" @click="alterarSenha">
            <span class="material-icons">lock</span>
            Alterar Senha
          </button>
          <button class="menu-item" @click="configuracoes">
            <span class="material-icons">settings</span>
            Configurações
          </button>
          <button class="menu-item" @click="ajuda">
            <span class="material-icons">help</span>
            Ajuda e Suporte
          </button>
          <button class="menu-item logout" @click="logout">
            <span class="material-icons">exit_to_app</span>
            Sair
          </button>
        </div>
      </div>
    </main>

    <!-- Clique fora para fechar o menu -->
    <div v-if="userMenuOpen" class="overlay" @click="userMenuOpen = false"></div>

    <!-- Modal de Erro -->
    <div v-if="erroDialog" class="modal-overlay" @click.self="erroDialog = false">
      <div class="modal-content">
        <div class="modal-header error">
          <h3>Erro</h3>
          <button class="close-btn" @click="erroDialog = false">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ erroMensagem }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="erroDialog = false">OK</button>
        </div>
      </div>
    </div>

    <!-- Modal Detalhes do Usuário -->
    <div v-if="usuarioDialog" class="modal-overlay" @click.self="usuarioDialog = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Detalhes do Usuário</h3>
          <button class="close-btn" @click="usuarioDialog = false">✕</button>
        </div>
        <div class="modal-body" v-if="usuarioSelecionado">
          <div class="user-profile">
            <img :src="usuarioSelecionado.avatar || 'https://cdn.quasar.dev/img/avatar2.jpg'" alt="Avatar">
            <h4>{{ usuarioSelecionado.nome }}</h4>
            <p>{{ usuarioSelecionado.email }}</p>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Tipo</span>
              <span class="value tag" :class="usuarioSelecionado.tipo?.toLowerCase()">{{ usuarioSelecionado.tipo }}</span>
            </div>
            <div class="info-item">
              <span class="label">Status</span>
              <span class="value tag" :class="usuarioSelecionado.status?.toLowerCase()">{{ usuarioSelecionado.status }}</span>
            </div>
            <div class="info-item">
              <span class="label">Telefone</span>
              <span class="value">{{ usuarioSelecionado.telefone || 'Não informado' }}</span>
            </div>
            <div class="info-item">
              <span class="label">Membro desde</span>
              <span class="value">{{ formatarData(usuarioSelecionado.created_at) }}</span>
            </div>
          </div>
          <div v-if="usuarioSelecionado.tipo === 'explicador'" class="explicador-stats">
            <h4>Estatísticas</h4>
            <div class="stats-grid">
              <div class="stat">
                <span class="value">{{ usuarioSelecionado.explicador?.sessoes_realizadas || 0 }}</span>
                <span class="label">Sessões</span>
              </div>
              <div class="stat">
                <span class="value">{{ usuarioSelecionado.explicador?.estudantes_atendidos || 0 }}</span>
                <span class="label">Alunos</span>
              </div>
              <div class="stat">
                <span class="value">{{ formatarPreco(usuarioSelecionado.explicador?.ganhos_mes || 0) }}</span>
                <span class="label">Ganhos/mês</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="usuarioDialog = false">Fechar</button>
          <button class="btn-primary" @click="editarUsuario(usuarioSelecionado)">Editar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../services/api.js'

export default {
  name: 'AdminPage',
  
  data() {
    return {
      // Estado
      loading: true,
      error: null,
      tab: 'dashboard',
      notificacoesNaoLidas: 3,
      userMenuOpen: false,
      
      // Usuário
      user: Api.AuthService.getUser() || {},
      
      // Diálogos
      erroDialog: false,
      erroMensagem: '',
      usuarioDialog: false,
      usuarioSelecionado: null,

      // Menu
      menuItems: [
        { id: 'dashboard', icon: 'dashboard', label: 'Início', badge: 0 },
        { id: 'usuarios', icon: 'people', label: 'Usuários', badge: 0 },
        { id: 'explicadores', icon: 'school', label: 'Explicadores', badge: 0 },
        { id: 'conteudos', icon: 'menu_book', label: 'Conteúdos', badge: 0 },
        { id: 'transacoes', icon: 'receipt', label: 'Transações', badge: 0 },
        { id: 'perfil', icon: 'person', label: 'Perfil', badge: 0 }
      ],

      // Filtros
      filtros: {
        usuarios: { busca: '', tipo: '', status: '' },
        explicadores: { busca: '', status: '' },
        conteudos: { busca: '', status: '', materia: '' },
        transacoes: { busca: '', tipo: '', status: '' }
      },

      // Paginação
      paginas: {
        usuarios: { currentPage: 1, totalPages: 1 },
        explicadores: { currentPage: 1, totalPages: 1 },
        conteudos: { currentPage: 1, totalPages: 1 },
        transacoes: { currentPage: 1, totalPages: 1 }
      },

      // Dados do Dashboard
      stats: {
        usuarios: { total: 0, novos_hoje: 0 },
        explicadores: { total: 0, pendentes: 0 },
        conteudos: { total: 0, pendentes: 0 },
        financeiro: { receita_mes: 0 }
      },
      atividades: [],
      topExplicadores: [],
      ultimosUsuarios: [],
      ultimasTransacoes: [],
      feedbacks: [],

      // Dados completos
      usuarios: [],
      usuariosOriginais: [],
      explicadores: [],
      explicadoresOriginais: [],
      conteudos: [],
      conteudosOriginais: [],
      transacoes: [],
      transacoesOriginais: []
    }
  },

  computed: {
    userNome() {
      return this.user?.nome || 'Admin'
    },
    userEmail() {
      return this.user?.email || 'admin@edulink.co.mz'
    },
    userAvatar() {
      return this.user?.avatar || 'https://cdn.quasar.dev/img/avatar6.jpg'
    },
    
    // Usuários filtrados
    usuariosFiltrados() {
      let result = [...this.usuarios]
      
      if (this.filtros.usuarios.busca) {
        const termo = this.filtros.usuarios.busca.toLowerCase()
        result = result.filter(u => 
          u.nome?.toLowerCase().includes(termo) ||
          u.email?.toLowerCase().includes(termo)
        )
      }
      
      if (this.filtros.usuarios.tipo) {
        result = result.filter(u => u.tipo === this.filtros.usuarios.tipo)
      }
      
      if (this.filtros.usuarios.status) {
        result = result.filter(u => u.status === this.filtros.usuarios.status)
      }
      
      return result
    },

    // Explicadores filtrados
    explicadoresFiltrados() {
      let result = [...this.explicadores]
      
      if (this.filtros.explicadores.busca) {
        const termo = this.filtros.explicadores.busca.toLowerCase()
        result = result.filter(e => 
          e.user?.nome?.toLowerCase().includes(termo) ||
          e.user?.email?.toLowerCase().includes(termo)
        )
      }
      
      if (this.filtros.explicadores.status) {
        result = result.filter(e => e.status === this.filtros.explicadores.status)
      }
      
      return result
    },

    // Conteúdos filtrados
    conteudosFiltrados() {
      let result = [...this.conteudos]
      
      if (this.filtros.conteudos.busca) {
        const termo = this.filtros.conteudos.busca.toLowerCase()
        result = result.filter(c => 
          c.titulo?.toLowerCase().includes(termo) ||
          c.explicador?.nome?.toLowerCase().includes(termo)
        )
      }
      
      if (this.filtros.conteudos.status) {
        result = result.filter(c => c.status === this.filtros.conteudos.status)
      }
      
      if (this.filtros.conteudos.materia) {
        result = result.filter(c => c.materia === this.filtros.conteudos.materia)
      }
      
      return result
    },

    // Transações filtradas
    transacoesFiltradas() {
      let result = [...this.transacoes]
      
      if (this.filtros.transacoes.busca) {
        const termo = this.filtros.transacoes.busca.toLowerCase()
        result = result.filter(t => 
          t.id?.toLowerCase().includes(termo) ||
          t.estudante_nome?.toLowerCase().includes(termo) ||
          t.explicador_nome?.toLowerCase().includes(termo)
        )
      }
      
      if (this.filtros.transacoes.tipo) {
        result = result.filter(t => t.tipo === this.filtros.transacoes.tipo)
      }
      
      if (this.filtros.transacoes.status) {
        result = result.filter(t => t.status === this.filtros.transacoes.status)
      }
      
      return result
    }
  },

  methods: {
    // ===== MENU DO USUÁRIO =====
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen
    },

    irParaPerfil() {
      this.userMenuOpen = false
      this.tab = 'perfil'
    },

    irParaConfiguracoes() {
      this.userMenuOpen = false
      alert('Função em desenvolvimento')
    },

    // ===== CARREGAMENTO DE DADOS =====
    async carregarDados() {
      this.loading = true
      this.error = null

      try {
        if (!Api.AuthService.isAuthenticated()) {
          window.location.href = '/login'
          return
        }

        const userFromStorage = Api.AuthService.getUser()
        if (userFromStorage) {
          this.user = userFromStorage
        }

        if (this.user.tipo !== 'admin') {
          window.location.href = '/'
          return
        }

        await Promise.allSettled([
          this.carregarDashboard(),
          this.carregarUsuarios(),
          this.carregarExplicadores(),
          this.carregarConteudos(),
          this.carregarTransacoes(),
          this.carregarFeedbacks()
        ])

        this.atualizarBadges()

      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        this.error = 'Não foi possível carregar os dados'
      } finally {
        this.loading = false
      }
    },

    async carregarDashboard() {
      try {
        const data = await Api.AdminService.getDashboard()
        
        this.stats = data.stats || this.stats
        this.atividades = this.processarAtividades(data.atividades)
        this.topExplicadores = data.atividades?.topExplicadores || this.topExplicadores
        this.ultimosUsuarios = data.atividades?.usuarios || []
        this.ultimasTransacoes = data.atividades?.transacoes || []
        
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
      }
    },

    async carregarUsuarios(page = 1) {
      try {
        const params = {
          page,
          ...this.filtros.usuarios
        }
        
        const data = await Api.AdminService.getUsuarios(params)
        
        this.usuarios = data.data || []
        this.usuariosOriginais = [...this.usuarios]
        this.paginas.usuarios = {
          currentPage: data.current_page || page,
          totalPages: data.last_page || 1
        }
        
      } catch (err) {
        console.error('Erro ao carregar usuários:', err)
      }
    },

    async carregarExplicadores(page = 1) {
      try {
        const params = {
          page,
          ...this.filtros.explicadores
        }
        
        const data = await Api.AdminService.getExplicadores(params)
        
        this.explicadores = data.data || []
        this.explicadoresOriginais = [...this.explicadores]
        this.paginas.explicadores = {
          currentPage: data.current_page || page,
          totalPages: data.last_page || 1
        }
        
      } catch (err) {
        console.error('Erro ao carregar explicadores:', err)
      }
    },

    async carregarConteudos(page = 1) {
      try {
        const params = {
          page,
          ...this.filtros.conteudos
        }
        
        const data = await Api.AdminService.getConteudos(params)
        
        this.conteudos = data.data || []
        this.conteudosOriginais = [...this.conteudos]
        this.paginas.conteudos = {
          currentPage: data.current_page || page,
          totalPages: data.last_page || 1
        }
        
      } catch (err) {
        console.error('Erro ao carregar conteúdos:', err)
      }
    },

    async carregarTransacoes(page = 1) {
      try {
        const params = {
          page,
          ...this.filtros.transacoes
        }
        
        const data = await Api.AdminService.getTransacoes(params)
        
        this.transacoes = data.data || []
        this.transacoesOriginais = [...this.transacoes]
        this.paginas.transacoes = {
          currentPage: data.current_page || page,
          totalPages: data.last_page || 1
        }
        
      } catch (err) {
        console.error('Erro ao carregar transações:', err)
        // Não mostrar erro para o usuário, apenas log
      }
    },

    async carregarFeedbacks() {
      try {
        const data = await Api.AdminService.getFeedbacks({ status: 'Pendente' })
        this.feedbacks = data.data || []
      } catch (err) {
        console.error('Erro ao carregar feedbacks:', err)
        this.feedbacks = []
      }
    },

    // ===== AÇÕES DE FILTRO =====
    filtrarUsuarios() {
      this.carregarUsuarios(1)
    },

    filtrarExplicadores() {
      this.carregarExplicadores(1)
    },

    filtrarConteudos() {
      this.carregarConteudos(1)
    },

    filtrarTransacoes() {
      this.carregarTransacoes(1)
    },

    // ===== AÇÕES DE USUÁRIOS =====
    async verUsuario(user) {
      try {
        const data = await Api.AdminService.getUsuario(user.id)
        this.usuarioSelecionado = data
        this.usuarioDialog = true
      } catch (err) {
        console.error('Erro ao ver usuário:', err)
        this.mostrarErro('Não foi possível carregar detalhes do usuário')
      }
    },

    async editarUsuario(user) {
      const nome = prompt('Novo nome:', user.nome)
      if (!nome) return

      try {
        await Api.AdminService.atualizarUsuario(user.id, { nome })
        user.nome = nome
        if (this.usuarioSelecionado) {
          this.usuarioSelecionado.nome = nome
        }
      } catch (err) {
        console.error('Erro ao editar usuário:', err)
        this.mostrarErro('Não foi possível editar o usuário')
      }
    },

    async toggleStatusUsuario(user) {
      const acao = user.status === 'Bloqueado' ? 'desbloquear' : 'bloquear'
      
      if (!confirm(`Deseja ${acao} ${user.nome}?`)) return

      try {
        await Api.AdminService.toggleUsuarioStatus(user.id)
        user.status = user.status === 'Bloqueado' ? 'Ativo' : 'Bloqueado'
        this.atualizarBadges()
      } catch (err) {
        console.error('Erro ao alterar status:', err)
        this.mostrarErro(`Não foi possível ${acao} o usuário`)
      }
    },

    // ===== AÇÕES DE EXPLICADORES =====
    async aprovarExplicador(exp) {
      if (!confirm(`Aprovar explicador ${exp.user?.nome}?`)) return

      try {
        await Api.AdminService.aprovarExplicador(exp.id)
        exp.status = 'Ativo'
        this.atualizarBadges()
      } catch (err) {
        console.error('Erro ao aprovar explicador:', err)
        this.mostrarErro('Não foi possível aprovar o explicador')
      }
    },

    verExplicador(exp) {
      this.verUsuario({ id: exp.user_id, tipo: 'explicador' })
    },

    // ===== AÇÕES DE CONTEÚDOS =====
    async aprovarConteudo(item) {
      try {
        await Api.AdminService.aprovarConteudo(item.id)
        item.status = 'Ativo'
        this.atualizarBadges()
      } catch (err) {
        console.error('Erro ao aprovar conteúdo:', err)
        this.mostrarErro('Não foi possível aprovar o conteúdo')
      }
    },

    async reprovarConteudo(item) {
      if (!confirm(`Reprovar conteúdo "${item.titulo}"?`)) return

      try {
        await Api.AdminService.reprovarConteudo(item.id)
        this.conteudos = this.conteudos.filter(c => c.id !== item.id)
        this.atualizarBadges()
      } catch (err) {
        console.error('Erro ao reprovar conteúdo:', err)
        this.mostrarErro('Não foi possível reprovar o conteúdo')
      }
    },

    async editarConteudo(item) {
      const preco = prompt('Novo preço (MZN):', item.preco)
      if (!preco) return

      try {
        await Api.AdminService.editarConteudo(item.id, { preco: parseInt(preco) })
        item.preco = parseInt(preco)
      } catch (err) {
        console.error('Erro ao editar conteúdo:', err)
        this.mostrarErro('Não foi possível editar o conteúdo')
      }
    },

    async toggleStatusConteudo(item) {
      const acao = item.status === 'Ativo' ? 'desativar' : 'ativar'
      
      if (!confirm(`${acao} o conteúdo "${item.titulo}"?`)) return

      try {
        await Api.AdminService.toggleConteudoStatus(item.id)
        item.status = item.status === 'Ativo' ? 'Inativo' : 'Ativo'
        this.atualizarBadges()
      } catch (err) {
        console.error('Erro ao alterar status:', err)
        this.mostrarErro(`Não foi possível ${acao} o conteúdo`)
      }
    },

    // ===== AÇÕES DO PERFIL =====
    editarPerfil() {
      const nome = prompt('Novo nome:', this.user.nome)
      if (!nome) return

      Api.AuthService.updateProfile({ nome })
        .then(() => {
          this.user.nome = nome
          alert('Perfil atualizado com sucesso!')
        })
        .catch(err => {
          console.error('Erro ao editar perfil:', err)
          this.mostrarErro('Não foi possível editar o perfil')
        })
    },

    alterarSenha() {
      const senhaAtual = prompt('Senha atual:')
      if (!senhaAtual) return
      
      const novaSenha = prompt('Nova senha:')
      if (!novaSenha) return
      
      const confirmarSenha = prompt('Confirmar nova senha:')
      if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem')
        return
      }

      Api.AuthService.changePassword({
        current_password: senhaAtual,
        new_password: novaSenha,
        new_password_confirmation: confirmarSenha
      })
        .then(() => {
          alert('Senha alterada com sucesso!')
        })
        .catch(err => {
          console.error('Erro ao alterar senha:', err)
          this.mostrarErro('Não foi possível alterar a senha')
        })
    },

    // ===== OUTRAS AÇÕES =====
    abrirNotificacoes() {
      this.mostrarErro('Função em desenvolvimento')
    },

    seguirCanal() {
      window.open('https://whatsapp.com', '_blank')
    },

    configuracoes() {
      alert('Função em desenvolvimento')
    },

    ajuda() {
      alert('Ajuda e Suporte: suporte@edulink.co.mz')
    },

    logout() {
      this.userMenuOpen = false
      if (confirm('Deseja realmente sair?')) {
        Api.AuthService.logout()
          .finally(() => {
            window.location.href = '/login'
          })
      }
    },

    // ===== UTILITÁRIOS =====
    processarAtividades(atividades) {
      if (!atividades) return []
      
      const lista = []
      
      if (atividades.usuarios) {
        atividades.usuarios.forEach(u => {
          lista.push({
            id: `user-${u.id}`,
            icon: 'person_add',
            cor: '#1976D2',
            titulo: 'Novo usuário',
            descricao: `${u.nome} criou conta`,
            tempo: this.timeAgo(u.created_at)
          })
        })
      }
      
      if (atividades.transacoes) {
        atividades.transacoes.forEach(t => {
          lista.push({
            id: `trans-${t.id}`,
            icon: 'attach_money',
            cor: '#28a745',
            titulo: 'Nova transação',
            descricao: `${this.formatarPreco(t.valor)} - ${t.descricao || 'Transação'}`,
            tempo: this.timeAgo(t.created_at)
          })
        })
      }
      
      if (atividades.feedbacks) {
        atividades.feedbacks.forEach(f => {
          lista.push({
            id: `fb-${f.id}`,
            icon: 'feedback',
            cor: '#ffc107',
            titulo: 'Novo feedback',
            descricao: f.texto?.substring(0, 30) + '...',
            tempo: this.timeAgo(f.created_at)
          })
        })
      }
      
      return lista.slice(0, 5)
    },

    atualizarBadges() {
      this.menuItems[0].badge = this.feedbacks.length
      this.menuItems[2].badge = this.explicadores.filter(e => e.status === 'Pendente').length
      this.menuItems[3].badge = this.conteudos.filter(c => c.status === 'Pendente').length
    },

    formatarPreco(valor) {
      if (valor === null || valor === undefined) return '0 MZN'
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: 'MZN',
        minimumFractionDigits: 0
      }).format(valor)
    },

    formatarData(data) {
      if (!data) return 'Data desconhecida'
      return new Date(data).toLocaleDateString('pt-MZ')
    },

    formatarDataHora(data) {
      if (!data) return 'Data desconhecida'
      return new Date(data).toLocaleString('pt-MZ')
    },

    timeAgo(data) {
      if (!data) return 'há pouco'
      const segundos = Math.floor((new Date() - new Date(data)) / 1000)
      if (segundos < 60) return 'agora'
      const minutos = Math.floor(segundos / 60)
      if (minutos < 60) return `há ${minutos} min`
      const horas = Math.floor(minutos / 60)
      if (horas < 24) return `há ${horas} h`
      const dias = Math.floor(horas / 24)
      return `há ${dias} d`
    },

    truncate(text, length) {
      if (!text) return ''
      if (text.length <= length) return text
      return text.substring(0, length) + '...'
    },

    mostrarErro(mensagem) {
      this.erroMensagem = mensagem
      this.erroDialog = true
    }
  },

  mounted() {
    this.carregarDados()
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.user-info') && !e.target.closest('.user-dropdown')) {
        this.userMenuOpen = false
      }
    })
  }
}
</script>

<style scoped>
/* Reset básico */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
  padding-bottom: 70px;
  position: relative;
}

/* Overlay para menu */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 15;
}

/* Header */
.admin-header {
  background: white;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info .name {
  font-weight: 600;
  font-size: 14px;
}

.info .role {
  font-size: 12px;
  color: #666;
}

.dropdown-icon {
  font-size: 18px;
  color: #666;
}

/* User Dropdown */
.user-dropdown {
  position: absolute;
  top: 60px;
  left: 0;
  width: 250px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 30;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
}

.dropdown-header .material-icons {
  font-size: 40px;
  color: #1976D2;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-email {
  font-size: 12px;
  color: #666;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.logout {
  color: #dc3545;
}

.dropdown-item.logout:hover {
  background: #ffebee;
}

.dropdown-item .material-icons {
  font-size: 20px;
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 10px;
  min-width: 16px;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.05);
  z-index: 10;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  position: relative;
}

.nav-item.active {
  color: #1976D2;
}

.nav-item .material-icons {
  font-size: 24px;
}

.nav-item .label {
  font-size: 11px;
  margin-top: 2px;
}

.nav-badge {
  position: absolute;
  top: 0;
  right: 20px;
  background: #dc3545;
  color: white;
  font-size: 9px;
  padding: 2px 4px;
  border-radius: 10px;
}

/* Loading e Error */
.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976D2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  color: #dc3545;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #1976D2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

/* Main Content */
.main-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.stat-box {
  background: white;
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  cursor: pointer;
  transition: transform 0.2s;
}

.stat-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
}

.stat-label {
  font-size: 11px;
  color: #666;
  margin-top: 4px;
}

.stat-trend {
  font-size: 10px;
  margin-top: 4px;
}

.stat-trend.positive { color: #28a745; }
.stat-trend.warning { color: #ffc107; }

/* List Cards */
.list-card {
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.list-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.view-all {
  background: none;
  border: none;
  color: #1976D2;
  font-size: 13px;
  cursor: pointer;
}

.list-items {
  padding: 8px 0;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.list-item:last-child {
  border-bottom: none;
}

.empty-item {
  padding: 32px 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* Ícones */
.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.item-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-dot.ativo { background: #28a745; }
.status-dot.inativo { background: #999; }
.status-dot.pendente { background: #ffc107; }
.status-dot.bloqueado { background: #dc3545; }
.status-dot.online { background: #28a745; }

/* Info */
.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.item-subtitle {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.item-date {
  font-size: 11px;
  color: #999;
}

.item-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.item-time {
  font-size: 11px;
  color: #999;
  white-space: nowrap;
}

/* Tags */
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 500;
}

.tag.estudante { background: #e3f2fd; color: #1976D2; }
.tag.explicador { background: #e0f2f1; color: #26A69A; }
.tag.admin { background: #f3e5f5; color: #9C27B0; }
.tag.ativo { background: #e8f5e9; color: #28a745; }
.tag.inativo { background: #eee; color: #666; }
.tag.pendente { background: #fff3e0; color: #ff9800; }
.tag.bloqueado { background: #ffebee; color: #dc3545; }
.tag.concluída { background: #e8f5e9; color: #28a745; }
.tag.cancelada { background: #ffebee; color: #dc3545; }
.tag.sugestão { background: #e3f2fd; color: #1976D2; }
.tag.reclamação { background: #ffebee; color: #dc3545; }
.tag.dúvida { background: #fff3e0; color: #ff9800; }
.tag.elogio { background: #e8f5e9; color: #28a745; }
.tag.secondary { background: #e0f2f1; color: #26A69A; }

/* Stats */
.item-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.item-stats .highlight {
  color: #1976D2;
  font-weight: 600;
}

.stat-badge {
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 11px;
}

.stat-badge.highlight {
  background: #e3f2fd;
  color: #1976D2;
}

/* Values */
.item-values {
  text-align: right;
}

.main-value {
  font-weight: 600;
  color: #1976D2;
  font-size: 14px;
}

.commission {
  font-size: 11px;
  color: #28a745;
}

/* Actions */
.item-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e0e0e0;
}

.action-btn.lock:hover { background: #ffebee; color: #dc3545; }
.action-btn.unlock:hover { background: #e8f5e9; color: #28a745; }
.action-btn.warning:hover { background: #fff3e0; color: #ff9800; }
.action-btn.success:hover { background: #e8f5e9; color: #28a745; }
.action-btn.danger:hover { background: #ffebee; color: #dc3545; }

/* Rating */
.rating {
  font-size: 12px;
  color: #ffc107;
  margin: 4px 0;
}

.rating span:last-child {
  color: #666;
  margin-left: 4px;
}

/* WhatsApp */
.whatsapp-card {
  background: #25D366;
  color: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.whatsapp-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.whatsapp-icon {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.whatsapp-text h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}

.whatsapp-text p {
  margin: 2px 0 0;
  font-size: 12px;
  opacity: 0.9;
}

.follow-btn {
  background: white;
  color: #25D366;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
}

/* Tab Page */
.tab-page {
  padding: 0 0 16px;
}

.tab-header {
  margin-bottom: 16px;
}

.tab-header h2 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.search-input {
  flex: 2;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
}

.filter-select {
  flex: 1;
  min-width: 120px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 14px;
  background: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 16px;
}

.page-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.page-btn.active {
  background: #1976D2;
  color: white;
  border-color: #1976D2;
}

/* Perfil */
.profile-header {
  text-align: center;
  margin-bottom: 24px;
}

.profile-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.profile-avatar .status-dot {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 15px;
  height: 15px;
  border: 3px solid white;
}

.profile-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 4px;
}

.profile-email {
  color: #666;
  margin-bottom: 4px;
}

.profile-role {
  color: #999;
  font-size: 14px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: #666;
  font-size: 13px;
}

.info-row .value {
  font-weight: 500;
  font-size: 13px;
}

.menu-list {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px;
  border: none;
  background: none;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item.logout {
  color: #dc3545;
}

.menu-item .material-icons {
  font-size: 20px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header.error {
  background: #dc3545;
  color: white;
}

.modal-header.warning {
  background: #ffc107;
  color: #333;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: inherit;
  padding: 4px;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #eee;
}

.btn-primary {
  padding: 8px 16px;
  background: #1976D2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-secondary {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

/* User Profile Modal */
.user-profile {
  text-align: center;
  margin-bottom: 20px;
}

.user-profile img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
}

.user-profile h4 {
  margin: 0 0 4px;
  font-size: 18px;
}

.user-profile p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 11px;
  color: #999;
}

.info-item .value {
  font-size: 14px;
  font-weight: 500;
}

.explicador-stats h4 {
  margin: 0 0 12px;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stats-grid .stat {
  text-align: center;
}

.stats-grid .value {
  font-size: 16px;
  font-weight: 600;
  color: #1976D2;
}

.stats-grid .label {
  font-size: 11px;
  color: #999;
}

/* Ícones de matéria */
.item-icon.matemática { background: #e3f2fd; color: #1976D2; }
.item-icon.física { background: #e0f2f1; color: #26A69A; }
.item-icon.química { background: #f3e5f5; color: #9C27B0; }
.item-icon.português { background: #e8f5e9; color: #28a745; }
.item-icon.sessão { background: #e0f2f1; color: #26A69A; }
.item-icon.conteúdo { background: #f3e5f5; color: #9C27B0; }

/* Responsivo */
@media (max-width: 480px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .header-actions {
    flex-direction: column;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }

  .item-stats {
    flex-direction: column;
    gap: 4px;
  }

  .whatsapp-card {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .nav-item .label {
    font-size: 10px;
  }
}
</style>