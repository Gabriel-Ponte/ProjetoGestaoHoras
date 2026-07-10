# UI Kit — design system

Reusable, token-driven components for a consistent look across the app.
Import everything from the barrel:

```jsx
import {
  AppLayout, PageContainer, PageHeader, SectionCard,
  AppButton, AppInput, AppSelect, FormGroup,
  DataTable, AppModal, ConfirmDialog,
  LoadingState, EmptyState, ErrorState,
} from '@/components/ui';
```

All components style themselves from the CSS variables in `src/index.css`
(`--primary-500`, `--grey-*`, `--shadow-*`, `--borderRadius`, …). Change a token
there and the whole kit updates. They coexist with Bootstrap — the kit does not
redefine Bootstrap classes.

> Goal: adopt incrementally. New screens should use the kit; existing screens can
> be migrated one at a time **without changing behaviour**.

---

## Layout

```jsx
// One-line page scaffold (use inside the dashboard shell)
<AppLayout
  title="Gestão Projetos"
  subtitle="43 projetos em espera"
  actions={<AppButton leftIcon={<FaPlus />}>Novo projeto</AppButton>}
>
  <SectionCard title="Filtros">…</SectionCard>
  <DataTable columns={cols} data={rows} />
</AppLayout>
```

- **`PageContainer`** — max-width + padding wrapper (`maxWidth`, `gap`).
- **`PageHeader`** — `title`, `subtitle`, `actions`, `divider`.
- **`SectionCard`** — `title`, `subtitle`, `actions`, `footer`, `noPadding`.

## Buttons

```jsx
<AppButton variant="primary">Guardar</AppButton>
<AppButton variant="secondary" size="sm">Cancelar</AppButton>
<AppButton variant="danger" leftIcon={<FaTrash />} loading>A apagar…</AppButton>
```
`variant`: `primary | secondary | danger | success | ghost | link` ·
`size`: `sm | md | lg` · `fullWidth`, `loading`, `leftIcon`, `rightIcon`.

## Forms

```jsx
<FormGroup label="Email" htmlFor="email" required error={errors.email}>
  <AppInput id="email" type="email" value={email} onChange={onChange} placeholder="nome@…" invalid={!!errors.email} />
</FormGroup>

<FormGroup label="Grupo" htmlFor="grupo">
  <AppSelect id="grupo" value={grupo} onChange={onChange}
    options={[{ value: 'lab', label: 'Laboratório' }, { value: 'proj', label: 'Projetos' }]}
    placeholder="Escolher…" />
</FormGroup>
```

## Data table

```jsx
<DataTable
  columns={[
    { key: 'cliente', header: 'Cliente', sortable: true },
    { key: 'nome', header: 'Projeto', render: (r) => <b>{r.nome}</b> },
    { key: 'alerta', header: 'Alerta', align: 'center', render: (r) => <Badge dias={r.alerta} /> },
  ]}
  data={projetos}
  keyField="_id"
  loading={isLoading}
  stickyHeader
  sortKey={sortKey} sortDir={sortDir} onSort={handleSort}
  onRowClick={(r) => open(r)}
/>
```
Built-in `loading` / `error` / empty states. `stickyHeader` sticks under the navbar
(uses `--navbar-height`).

## Modals & confirmation

```jsx
<AppModal open={open} onClose={close} title="Exportar horas"
  footer={<><AppButton variant="secondary" onClick={close}>Fechar</AppButton>
           <AppButton onClick={exportar}>Exportar</AppButton></>}>
  … body …
</AppModal>

<ConfirmDialog
  open={confirming}
  title="Apagar projeto?"
  message="Esta ação não pode ser revertida."
  variant="danger"
  loading={deleting}
  onConfirm={handleDelete}
  onCancel={() => setConfirming(false)}
/>
```
Accessible: focus handling, `Esc` to close, backdrop click, body-scroll lock,
rendered in a portal.

## States

```jsx
if (isLoading) return <LoadingState message="A carregar projetos…" />;
if (error)     return <ErrorState message="Não foi possível carregar." onRetry={refetch} />;
if (!data.length) return <EmptyState title="Sem projetos" message="Ainda não há projetos."
                            action={<AppButton>Criar projeto</AppButton>} />;
```
Add `inline` to keep them compact inside a card/table.
