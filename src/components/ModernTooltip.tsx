import { styled } from '@mui/material/styles';
import Tooltip, { type TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

const ModernTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
    padding: '8px 14px',
    borderRadius: 8,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: 220,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#1a1a1a',
    '&::before': {
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
}));

export default ModernTooltip;
