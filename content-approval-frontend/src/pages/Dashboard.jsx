import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { ContentCard } from '@/components/ui/content-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth.jsx';
import { apiClient } from '@/lib/api';
import { Plus, Search, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export function Dashboard() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pendente: 0,
    aprovado: 0,
    rejeitado: 0,
    em_revisao: 0,
  });

  const { user, isCliente, isAprovador } = useAuth();

  useEffect(() => {
    loadCards();
  }, [statusFilter, typeFilter]);

  const loadCards = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }

      const data = await apiClient.getContentCards(params);
      setCards(data.cards || []);
      
      // Calcular estatísticas
      const newStats = data.cards.reduce((acc, card) => {
        acc.total++;
        acc[card.status] = (acc[card.status] || 0) + 1;
        return acc;
      }, { total: 0, pendente: 0, aprovado: 0, rejeitado: 0, em_revisao: 0 });
      
      setStats(newStats);
    } catch (error) {
      setError('Erro ao carregar cards: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (card) => {
    try {
      await apiClient.approveContentCard(card.id, 'aprovado');
      await loadCards();
    } catch (error) {
      setError('Erro ao aprovar card: ' + error.message);
    }
  };

  const handleReject = async (card) => {
    try {
      await apiClient.approveContentCard(card.id, 'rejeitado');
      await loadCards();
    } catch (error) {
      setError('Erro ao rejeitar card: ' + error.message);
    }
  };

  const handleViewCard = (card) => {
    // Navegar para página de detalhes do card
    window.location.href = `/cards/${card.id}`;
  };

  const filteredCards = cards.filter(card => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        card.title.toLowerCase().includes(searchLower) ||
        card.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const statsCards = [
    {
      title: 'Total de Cards',
      value: stats.total,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pendentes',
      value: stats.pendente,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Aprovados',
      value: stats.aprovado,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Rejeitados',
      value: stats.rejeitado,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <Layout currentPath="/">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Bem-vindo, {user?.name}! Gerencie seus cards de conteúdo.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters and Actions */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar cards..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    <SelectItem value="em_revisao">Em Revisão</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="cronograma_macro_mensal">Cronograma Macro</SelectItem>
                    <SelectItem value="postagem_arte_mensal">Arte Mensal</SelectItem>
                    <SelectItem value="postagem_diaria">Postagem Diária</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {!isCliente && !isAprovador && (
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Card
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCards.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum card encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca.'
                  : 'Comece criando seu primeiro card de conteúdo.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <ContentCard
                key={card.id}
                card={card}
                onView={handleViewCard}
                onApprove={handleApprove}
                onReject={handleReject}
                showActions={isCliente || isAprovador}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

