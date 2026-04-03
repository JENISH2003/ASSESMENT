export default function AuthHeader({ title, subtitle }) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl font-heading font-extrabold text-gradient mb-2">
        {title}
      </h2>
      <p className="text-muted-foreground font-medium">{subtitle}</p>
    </div>
  );
}
