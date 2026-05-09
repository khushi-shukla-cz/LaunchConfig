"use client";
import React, { useEffect, useState } from "react";
import { UIPage, AppConfig, Resource } from "@shared/schemas/config.schema";
import { DynamicForm } from "@/components/forms/DynamicForm";
import { DynamicTable } from "@/components/tables/DynamicTable";
import { useResourceStore } from "@/lib/store";
import { useRouter } from "next/navigation";

interface DynamicPageProps {
  page: UIPage;
  config: AppConfig;
  params?: Record<string, string>;
}

// ─── Fallback renderer for unknown components ─────────────────────────────────

function UnknownComponent({ page }: { page: UIPage }) {
  return (
    <div className="p-8 border-2 border-dashed border-amber-300 rounded-xl bg-amber-50 text-center space-y-2">
      <div className="text-2xl">⚠️</div>
      <p className="font-medium text-amber-800">Unknown component type: <code className="bg-amber-200 px-1 rounded">{page.component}</code></p>
      <p className="text-sm text-amber-600">This component type is not registered. The page will render when the component is added.</p>
      <pre className="text-xs text-left bg-amber-100 p-3 rounded mt-3 overflow-auto">{JSON.stringify(page, null, 2)}</pre>
    </div>
  );
}

// ─── Table page ───────────────────────────────────────────────────────────────

function TablePage({ page, config }: { page: UIPage; config: AppConfig }) {
  const router = useRouter();
  const resource = config.resources.find((r) => r.name === page.resource);

  if (!resource) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
        Resource <code>{page.resource}</code> not found in config. Check your configuration.
      </div>
    );
  }

  return (
    <DynamicTable
      resource={resource}
      onNew={() => router.push(`/${resource.name}/new`)}
    />
  );
}

// ─── Form page ────────────────────────────────────────────────────────────────

function FormPage({ page, config, params }: { page: UIPage; config: AppConfig; params?: Record<string, string> }) {
  const router = useRouter();
  const resource = config.resources.find((r) => r.name === page.resource);
  const isEdit = !!params?.id;

  const store = resource ? useResourceStore(resource.name) : null;
  const [initialData, setInitialData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(isEdit);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && resource && params?.id) {
      store?.fetchOne(params.id).then((data) => {
        if (data) setInitialData(data);
        setLoading(false);
      });
    }
  }, [params?.id]);

  if (!resource) {
    return (
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-amber-700">
        Resource <code>{page.resource}</code> not found in config.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSubmitError(null);
    setServerErrors({});

    if (!store) return;

    let result;
    if (isEdit && params?.id) {
      result = await store.update(params.id, data);
    } else {
      result = await store.create(data);
    }

    if (result.success) {
      router.push(`/${resource.name}`);
    } else if (result.errors && typeof result.errors === "object") {
      setServerErrors(result.errors);
    } else {
      setSubmitError(result.error || "An error occurred");
    }
  };

  return (
    <div>
      {submitError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {submitError}
        </div>
      )}
      <DynamicForm
        resource={resource}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/${resource.name}`)}
        mode={isEdit ? "edit" : "create"}
        serverErrors={serverErrors}
      />
    </div>
  );
}

// ─── Detail page ──────────────────────────────────────────────────────────────

function DetailPage({ page, config, params }: { page: UIPage; config: AppConfig; params?: Record<string, string> }) {
  const router = useRouter();
  const resource = config.resources.find((r) => r.name === page.resource);
  const store = resource ? useResourceStore(resource.name) : null;
  const [record, setRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (resource && params?.id) {
      store?.fetchOne(params.id).then((data) => {
        setRecord(data);
        setLoading(false);
      });
    }
  }, [params?.id]);

  if (!resource) return <div className="text-amber-700">Resource not found</div>;

  if (loading) return <div className="animate-pulse space-y-3">{Array.from({length:5}).map((_,i) => <div key={i} className="h-8 bg-gray-100 rounded" />)}</div>;

  if (!record) return <div className="text-gray-500">Record not found</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resource.fields.filter((f) => !f.hidden).map((field) => (
          <div key={field.name} className="space-y-1">
            <dt className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{field.label}</dt>
            <dd className="text-sm text-gray-800">
              {record[field.name] !== null && record[field.name] !== undefined
                ? field.type === "boolean"
                  ? record[field.name] ? "Yes" : "No"
                  : field.type === "json"
                    ? <pre className="font-mono text-xs bg-gray-50 p-2 rounded">{JSON.stringify(record[field.name], null, 2)}</pre>
                    : String(record[field.name])
                : <span className="text-gray-300 italic">—</span>
              }
            </dd>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => router.push(`/${resource.name}/${params?.id}/edit`)}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
        >Edit</button>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >Back</button>
      </div>
    </div>
  );
}

// ─── Main Dynamic Page Renderer ────────────────────────────────────────────────

const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
  table: TablePage,
  form: FormPage,
  detail: DetailPage,
};

export function DynamicPageRenderer({ page, config, params }: DynamicPageProps) {
  const Component = COMPONENT_REGISTRY[page.component];

  if (!Component) {
    return <UnknownComponent page={page} />;
  }

  return <Component page={page} config={config} params={params} />;
}

// ─── Component Registry (extensible) ─────────────────────────────────────────

export function registerComponent(type: string, component: React.ComponentType<any>) {
  COMPONENT_REGISTRY[type] = component;
}
