export default function PageHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-border/50">
      {Icon && (
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <div>
        <h1 className="text-3xl font-heading font-bold">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
