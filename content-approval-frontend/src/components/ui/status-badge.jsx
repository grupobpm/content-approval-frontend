import { cn } from '@/lib/utils';

const statusConfig = {
  pendente: {
    label: 'Pendente',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  aprovado: {
    label: 'Aprovado',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  rejeitado: {
    label: 'Rejeitado',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  em_revisao: {
    label: 'Em Revisão',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
};

export function StatusBadge({ status, className }) {
  const config = statusConfig[status] || statusConfig.pendente;

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

