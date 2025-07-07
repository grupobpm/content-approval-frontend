import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, MessageCircle, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeLabels = {
  cronograma_macro_mensal: 'Cronograma Macro Mensal',
  postagem_arte_mensal: 'Postagem de Arte Mensal',
  postagem_diaria: 'Postagem Diária',
};

export function ContentCard({ 
  card, 
  onView, 
  onApprove, 
  onReject, 
  showActions = true,
  className 
}) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleApprove = (e) => {
    e.stopPropagation();
    onApprove?.(card);
  };

  const handleReject = (e) => {
    e.stopPropagation();
    onReject?.(card);
  };

  const handleView = () => {
    onView?.(card);
  };

  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]',
        className
      )}
      onClick={handleView}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              {card.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {typeLabels[card.type] || card.type}
            </p>
          </div>
          <StatusBadge status={card.status} />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {card.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{card.createdBy?.name}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(card.createdAt)}</span>
          </div>

          {card.commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{card.commentsCount}</span>
            </div>
          )}

          {card.attachments?.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              <span>{card.attachments.length}</span>
            </div>
          )}
        </div>

        {showActions && card.status === 'pendente' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleApprove}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              Rejeitar
            </Button>
          </div>
        )}

        {card.dueDate && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>Vencimento: {formatDate(card.dueDate)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

