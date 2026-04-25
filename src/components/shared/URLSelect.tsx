import { useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface URLSelectProps {
  label: string;
  paramKey: string;
  options: { label: string; value: string }[];
  placeholder?: string;
  icon?: React.ElementType;
}

export const URLSelect = ({ label, paramKey, options, placeholder, icon: Icon }: URLSelectProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(paramKey) || 'all';

  const handleChange = (newValue: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (newValue && newValue !== 'all') {
      newParams.set(paramKey, newValue);
    } else {
      newParams.delete(paramKey);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium flex items-center gap-2">
        {Icon && <Icon className="w-3.5 h-3.5" />} {label}
      </Label>
      <Select value={value} onValueChange={handleChange}>
        <SelectTrigger className="bg-background/50">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
