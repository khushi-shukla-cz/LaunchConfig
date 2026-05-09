import { z } from "zod";
export declare const FieldTypeSchema: z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>;
export type FieldType = z.infer<typeof FieldTypeSchema>;
export declare const ValidationRuleSchema: z.ZodObject<{
    type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
    value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
    value?: string | number | boolean | undefined;
    message?: string | undefined;
}, {
    type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
    value?: string | number | boolean | undefined;
    message?: string | undefined;
}>;
export type ValidationRule = z.infer<typeof ValidationRuleSchema>;
export declare const FieldSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
    required: z.ZodDefault<z.ZodBoolean>;
    unique: z.ZodDefault<z.ZodBoolean>;
    defaultValue: z.ZodOptional<z.ZodUnknown>;
    options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>]>, "many">>;
    validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
        value?: string | number | boolean | undefined;
        message?: string | undefined;
    }, {
        type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
        value?: string | number | boolean | undefined;
        message?: string | undefined;
    }>, "many">>;
    hidden: z.ZodDefault<z.ZodBoolean>;
    readonly: z.ZodDefault<z.ZodBoolean>;
    placeholder: z.ZodOptional<z.ZodString>;
    helpText: z.ZodOptional<z.ZodString>;
    relation: z.ZodOptional<z.ZodObject<{
        resource: z.ZodString;
        labelField: z.ZodDefault<z.ZodString>;
        valueField: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        resource: string;
        labelField: string;
        valueField: string;
    }, {
        resource: string;
        labelField?: string | undefined;
        valueField?: string | undefined;
    }>>;
    i18nKey: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
    required: z.ZodDefault<z.ZodBoolean>;
    unique: z.ZodDefault<z.ZodBoolean>;
    defaultValue: z.ZodOptional<z.ZodUnknown>;
    options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>]>, "many">>;
    validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
        value?: string | number | boolean | undefined;
        message?: string | undefined;
    }, {
        type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
        value?: string | number | boolean | undefined;
        message?: string | undefined;
    }>, "many">>;
    hidden: z.ZodDefault<z.ZodBoolean>;
    readonly: z.ZodDefault<z.ZodBoolean>;
    placeholder: z.ZodOptional<z.ZodString>;
    helpText: z.ZodOptional<z.ZodString>;
    relation: z.ZodOptional<z.ZodObject<{
        resource: z.ZodString;
        labelField: z.ZodDefault<z.ZodString>;
        valueField: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        resource: string;
        labelField: string;
        valueField: string;
    }, {
        resource: string;
        labelField?: string | undefined;
        valueField?: string | undefined;
    }>>;
    i18nKey: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
    required: z.ZodDefault<z.ZodBoolean>;
    unique: z.ZodDefault<z.ZodBoolean>;
    defaultValue: z.ZodOptional<z.ZodUnknown>;
    options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>]>, "many">>;
    validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        message: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
        value?: string | number | boolean | undefined;
        message?: string | undefined;
    }, {
        type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
        value?: string | number | boolean | undefined;
        message?: string | undefined;
    }>, "many">>;
    hidden: z.ZodDefault<z.ZodBoolean>;
    readonly: z.ZodDefault<z.ZodBoolean>;
    placeholder: z.ZodOptional<z.ZodString>;
    helpText: z.ZodOptional<z.ZodString>;
    relation: z.ZodOptional<z.ZodObject<{
        resource: z.ZodString;
        labelField: z.ZodDefault<z.ZodString>;
        valueField: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        resource: string;
        labelField: string;
        valueField: string;
    }, {
        resource: string;
        labelField?: string | undefined;
        valueField?: string | undefined;
    }>>;
    i18nKey: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export type Field = z.infer<typeof FieldSchema>;
export declare const ResourcePermissionSchema: z.ZodObject<{
    create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
}, "strip", z.ZodTypeAny, {
    create: boolean | string[];
    read: boolean | string[];
    update: boolean | string[];
    delete: boolean | string[];
}, {
    create?: boolean | string[] | undefined;
    read?: boolean | string[] | undefined;
    update?: boolean | string[] | undefined;
    delete?: boolean | string[] | undefined;
}>;
export type ResourcePermission = z.infer<typeof ResourcePermissionSchema>;
export declare const ResourceSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    pluralLabel: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    timestamps: z.ZodDefault<z.ZodBoolean>;
    softDelete: z.ZodDefault<z.ZodBoolean>;
    permissions: z.ZodOptional<z.ZodObject<{
        create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    }, "strip", z.ZodTypeAny, {
        create: boolean | string[];
        read: boolean | string[];
        update: boolean | string[];
        delete: boolean | string[];
    }, {
        create?: boolean | string[] | undefined;
        read?: boolean | string[] | undefined;
        update?: boolean | string[] | undefined;
        delete?: boolean | string[] | undefined;
    }>>;
    searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    displayField: z.ZodOptional<z.ZodString>;
    hooks: z.ZodOptional<z.ZodObject<{
        beforeCreate: z.ZodOptional<z.ZodString>;
        afterCreate: z.ZodOptional<z.ZodString>;
        beforeUpdate: z.ZodOptional<z.ZodString>;
        afterUpdate: z.ZodOptional<z.ZodString>;
        beforeDelete: z.ZodOptional<z.ZodString>;
        afterDelete: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    pluralLabel: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    timestamps: z.ZodDefault<z.ZodBoolean>;
    softDelete: z.ZodDefault<z.ZodBoolean>;
    permissions: z.ZodOptional<z.ZodObject<{
        create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    }, "strip", z.ZodTypeAny, {
        create: boolean | string[];
        read: boolean | string[];
        update: boolean | string[];
        delete: boolean | string[];
    }, {
        create?: boolean | string[] | undefined;
        read?: boolean | string[] | undefined;
        update?: boolean | string[] | undefined;
        delete?: boolean | string[] | undefined;
    }>>;
    searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    displayField: z.ZodOptional<z.ZodString>;
    hooks: z.ZodOptional<z.ZodObject<{
        beforeCreate: z.ZodOptional<z.ZodString>;
        afterCreate: z.ZodOptional<z.ZodString>;
        beforeUpdate: z.ZodOptional<z.ZodString>;
        afterUpdate: z.ZodOptional<z.ZodString>;
        beforeDelete: z.ZodOptional<z.ZodString>;
        afterDelete: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    pluralLabel: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
        required: z.ZodDefault<z.ZodBoolean>;
        unique: z.ZodDefault<z.ZodBoolean>;
        defaultValue: z.ZodOptional<z.ZodUnknown>;
        options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>]>, "many">>;
        validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
            value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            message: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }, {
            type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
            value?: string | number | boolean | undefined;
            message?: string | undefined;
        }>, "many">>;
        hidden: z.ZodDefault<z.ZodBoolean>;
        readonly: z.ZodDefault<z.ZodBoolean>;
        placeholder: z.ZodOptional<z.ZodString>;
        helpText: z.ZodOptional<z.ZodString>;
        relation: z.ZodOptional<z.ZodObject<{
            resource: z.ZodString;
            labelField: z.ZodDefault<z.ZodString>;
            valueField: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            resource: string;
            labelField: string;
            valueField: string;
        }, {
            resource: string;
            labelField?: string | undefined;
            valueField?: string | undefined;
        }>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">;
    timestamps: z.ZodDefault<z.ZodBoolean>;
    softDelete: z.ZodDefault<z.ZodBoolean>;
    permissions: z.ZodOptional<z.ZodObject<{
        create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    }, "strip", z.ZodTypeAny, {
        create: boolean | string[];
        read: boolean | string[];
        update: boolean | string[];
        delete: boolean | string[];
    }, {
        create?: boolean | string[] | undefined;
        read?: boolean | string[] | undefined;
        update?: boolean | string[] | undefined;
        delete?: boolean | string[] | undefined;
    }>>;
    searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    displayField: z.ZodOptional<z.ZodString>;
    hooks: z.ZodOptional<z.ZodObject<{
        beforeCreate: z.ZodOptional<z.ZodString>;
        afterCreate: z.ZodOptional<z.ZodString>;
        beforeUpdate: z.ZodOptional<z.ZodString>;
        afterUpdate: z.ZodOptional<z.ZodString>;
        beforeDelete: z.ZodOptional<z.ZodString>;
        afterDelete: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }, {
        beforeCreate?: string | undefined;
        afterCreate?: string | undefined;
        beforeUpdate?: string | undefined;
        afterUpdate?: string | undefined;
        beforeDelete?: string | undefined;
        afterDelete?: string | undefined;
    }>>;
}, z.ZodTypeAny, "passthrough">>;
export type Resource = z.infer<typeof ResourceSchema>;
export declare const UIComponentSchema: z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>;
export declare const UIPageSchema: z.ZodObject<{
    id: z.ZodString;
    path: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
    resource: z.ZodOptional<z.ZodString>;
    layout: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    i18nKey: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    id: z.ZodString;
    path: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
    resource: z.ZodOptional<z.ZodString>;
    layout: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    i18nKey: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    id: z.ZodString;
    path: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
    resource: z.ZodOptional<z.ZodString>;
    layout: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    i18nKey: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export type UIPage = z.infer<typeof UIPageSchema>;
export declare const UINavItemSchema: z.ZodObject<{
    label: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    icon: z.ZodOptional<z.ZodString>;
    children: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<any, z.ZodTypeDef, any>>, "many">>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    i18nKey: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    label: string;
    path?: string | undefined;
    i18nKey?: string | undefined;
    icon?: string | undefined;
    permissions?: string[] | undefined;
    children?: any[] | undefined;
}, {
    label: string;
    path?: string | undefined;
    i18nKey?: string | undefined;
    icon?: string | undefined;
    permissions?: string[] | undefined;
    children?: any[] | undefined;
}>;
export type UINavItem = z.infer<typeof UINavItemSchema>;
export declare const UIConfigSchema: z.ZodDefault<z.ZodObject<{
    theme: z.ZodDefault<z.ZodObject<{
        primaryColor: z.ZodDefault<z.ZodString>;
        fontFamily: z.ZodDefault<z.ZodString>;
        mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
        borderRadius: z.ZodDefault<z.ZodString>;
        customCss: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        primaryColor: string;
        fontFamily: string;
        mode: "light" | "dark" | "auto";
        borderRadius: string;
        customCss?: string | undefined;
    }, {
        primaryColor?: string | undefined;
        fontFamily?: string | undefined;
        mode?: "light" | "dark" | "auto" | undefined;
        borderRadius?: string | undefined;
        customCss?: string | undefined;
    }>>;
    navigation: z.ZodDefault<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        children: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<any, z.ZodTypeDef, any>>, "many">>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        label: string;
        path?: string | undefined;
        i18nKey?: string | undefined;
        icon?: string | undefined;
        permissions?: string[] | undefined;
        children?: any[] | undefined;
    }, {
        label: string;
        path?: string | undefined;
        i18nKey?: string | undefined;
        icon?: string | undefined;
        permissions?: string[] | undefined;
        children?: any[] | undefined;
    }>, "many">>;
    pages: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        path: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
        resource: z.ZodOptional<z.ZodString>;
        layout: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        id: z.ZodString;
        path: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
        resource: z.ZodOptional<z.ZodString>;
        layout: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        id: z.ZodString;
        path: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
        resource: z.ZodOptional<z.ZodString>;
        layout: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    layout: z.ZodDefault<z.ZodEnum<["sidebar", "topnav", "minimal"]>>;
    logo: z.ZodOptional<z.ZodString>;
    appName: z.ZodOptional<z.ZodString>;
    favicon: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    layout: "sidebar" | "topnav" | "minimal";
    theme: {
        primaryColor: string;
        fontFamily: string;
        mode: "light" | "dark" | "auto";
        borderRadius: string;
        customCss?: string | undefined;
    };
    navigation: {
        label: string;
        path?: string | undefined;
        i18nKey?: string | undefined;
        icon?: string | undefined;
        permissions?: string[] | undefined;
        children?: any[] | undefined;
    }[];
    pages: z.objectOutputType<{
        id: z.ZodString;
        path: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
        resource: z.ZodOptional<z.ZodString>;
        layout: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">[];
    logo?: string | undefined;
    appName?: string | undefined;
    favicon?: string | undefined;
}, {
    layout?: "sidebar" | "topnav" | "minimal" | undefined;
    theme?: {
        primaryColor?: string | undefined;
        fontFamily?: string | undefined;
        mode?: "light" | "dark" | "auto" | undefined;
        borderRadius?: string | undefined;
        customCss?: string | undefined;
    } | undefined;
    navigation?: {
        label: string;
        path?: string | undefined;
        i18nKey?: string | undefined;
        icon?: string | undefined;
        permissions?: string[] | undefined;
        children?: any[] | undefined;
    }[] | undefined;
    pages?: z.objectInputType<{
        id: z.ZodString;
        path: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
        resource: z.ZodOptional<z.ZodString>;
        layout: z.ZodOptional<z.ZodString>;
        permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        i18nKey: z.ZodOptional<z.ZodString>;
    }, z.ZodTypeAny, "passthrough">[] | undefined;
    logo?: string | undefined;
    appName?: string | undefined;
    favicon?: string | undefined;
}>>;
export type UIConfig = z.infer<typeof UIConfigSchema>;
export declare const AuthProviderSchema: z.ZodEnum<["email", "google", "github", "otp", "magic-link"]>;
export declare const RoleSchema: z.ZodObject<{
    name: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    isDefault: z.ZodDefault<z.ZodBoolean>;
    isAdmin: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    permissions: string[];
    isDefault: boolean;
    isAdmin: boolean;
    label?: string | undefined;
}, {
    name: string;
    label?: string | undefined;
    permissions?: string[] | undefined;
    isDefault?: boolean | undefined;
    isAdmin?: boolean | undefined;
}>;
export type Role = z.infer<typeof RoleSchema>;
export declare const AuthConfigSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    providers: z.ZodDefault<z.ZodArray<z.ZodEnum<["email", "google", "github", "otp", "magic-link"]>, "many">>;
    roles: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        isDefault: z.ZodDefault<z.ZodBoolean>;
        isAdmin: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        permissions: string[];
        isDefault: boolean;
        isAdmin: boolean;
        label?: string | undefined;
    }, {
        name: string;
        label?: string | undefined;
        permissions?: string[] | undefined;
        isDefault?: boolean | undefined;
        isAdmin?: boolean | undefined;
    }>, "many">>;
    sessionDuration: z.ZodDefault<z.ZodNumber>;
    requireEmailVerification: z.ZodDefault<z.ZodBoolean>;
    allowRegistration: z.ZodDefault<z.ZodBoolean>;
    passwordPolicy: z.ZodDefault<z.ZodObject<{
        minLength: z.ZodDefault<z.ZodNumber>;
        requireUppercase: z.ZodDefault<z.ZodBoolean>;
        requireNumbers: z.ZodDefault<z.ZodBoolean>;
        requireSymbols: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        minLength: number;
        requireUppercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
    }, {
        minLength?: number | undefined;
        requireUppercase?: boolean | undefined;
        requireNumbers?: boolean | undefined;
        requireSymbols?: boolean | undefined;
    }>>;
    redirectAfterLogin: z.ZodDefault<z.ZodString>;
    redirectAfterLogout: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    providers: ("email" | "google" | "github" | "otp" | "magic-link")[];
    roles: {
        name: string;
        permissions: string[];
        isDefault: boolean;
        isAdmin: boolean;
        label?: string | undefined;
    }[];
    sessionDuration: number;
    requireEmailVerification: boolean;
    allowRegistration: boolean;
    passwordPolicy: {
        minLength: number;
        requireUppercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
    };
    redirectAfterLogin: string;
    redirectAfterLogout: string;
}, {
    enabled?: boolean | undefined;
    providers?: ("email" | "google" | "github" | "otp" | "magic-link")[] | undefined;
    roles?: {
        name: string;
        label?: string | undefined;
        permissions?: string[] | undefined;
        isDefault?: boolean | undefined;
        isAdmin?: boolean | undefined;
    }[] | undefined;
    sessionDuration?: number | undefined;
    requireEmailVerification?: boolean | undefined;
    allowRegistration?: boolean | undefined;
    passwordPolicy?: {
        minLength?: number | undefined;
        requireUppercase?: boolean | undefined;
        requireNumbers?: boolean | undefined;
        requireSymbols?: boolean | undefined;
    } | undefined;
    redirectAfterLogin?: string | undefined;
    redirectAfterLogout?: string | undefined;
}>>;
export type AuthConfig = z.infer<typeof AuthConfigSchema>;
export declare const FeatureConfigSchema: z.ZodObject<{
    name: z.ZodString;
    enabled: z.ZodDefault<z.ZodBoolean>;
    config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    version: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    enabled: boolean;
    config: Record<string, unknown>;
    version?: string | undefined;
}, {
    name: string;
    enabled?: boolean | undefined;
    config?: Record<string, unknown> | undefined;
    version?: string | undefined;
}>;
export type FeatureConfig = z.infer<typeof FeatureConfigSchema>;
export declare const I18nConfigSchema: z.ZodDefault<z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    defaultLocale: z.ZodDefault<z.ZodString>;
    supportedLocales: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    fallbackLocale: z.ZodDefault<z.ZodString>;
    translations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>>>;
    dateFormat: z.ZodDefault<z.ZodString>;
    numberFormat: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    defaultLocale: string;
    supportedLocales: string[];
    fallbackLocale: string;
    translations: Record<string, Record<string, string>>;
    dateFormat: string;
    numberFormat: string;
}, {
    enabled?: boolean | undefined;
    defaultLocale?: string | undefined;
    supportedLocales?: string[] | undefined;
    fallbackLocale?: string | undefined;
    translations?: Record<string, Record<string, string>> | undefined;
    dateFormat?: string | undefined;
    numberFormat?: string | undefined;
}>>;
export type I18nConfig = z.infer<typeof I18nConfigSchema>;
export declare const APIConfigSchema: z.ZodDefault<z.ZodObject<{
    prefix: z.ZodDefault<z.ZodString>;
    version: z.ZodDefault<z.ZodString>;
    rateLimit: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        windowMs: z.ZodDefault<z.ZodNumber>;
        max: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        max: number;
        enabled: boolean;
        windowMs: number;
    }, {
        max?: number | undefined;
        enabled?: boolean | undefined;
        windowMs?: number | undefined;
    }>>;
    cors: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        origins: string[];
    }, {
        enabled?: boolean | undefined;
        origins?: string[] | undefined;
    }>>;
    pagination: z.ZodDefault<z.ZodObject<{
        defaultLimit: z.ZodDefault<z.ZodNumber>;
        maxLimit: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        defaultLimit: number;
        maxLimit: number;
    }, {
        defaultLimit?: number | undefined;
        maxLimit?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    version: string;
    prefix: string;
    rateLimit: {
        max: number;
        enabled: boolean;
        windowMs: number;
    };
    cors: {
        enabled: boolean;
        origins: string[];
    };
    pagination: {
        defaultLimit: number;
        maxLimit: number;
    };
}, {
    version?: string | undefined;
    prefix?: string | undefined;
    rateLimit?: {
        max?: number | undefined;
        enabled?: boolean | undefined;
        windowMs?: number | undefined;
    } | undefined;
    cors?: {
        enabled?: boolean | undefined;
        origins?: string[] | undefined;
    } | undefined;
    pagination?: {
        defaultLimit?: number | undefined;
        maxLimit?: number | undefined;
    } | undefined;
}>>;
export type APIConfig = z.infer<typeof APIConfigSchema>;
export declare const DatabaseConfigSchema: z.ZodDefault<z.ZodObject<{
    provider: z.ZodDefault<z.ZodEnum<["postgresql", "mysql", "sqlite", "mongodb"]>>;
    migrationStrategy: z.ZodDefault<z.ZodEnum<["auto", "manual", "none"]>>;
    seedOnInit: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    provider: "postgresql" | "mysql" | "sqlite" | "mongodb";
    migrationStrategy: "auto" | "manual" | "none";
    seedOnInit: boolean;
}, {
    provider?: "postgresql" | "mysql" | "sqlite" | "mongodb" | undefined;
    migrationStrategy?: "auto" | "manual" | "none" | undefined;
    seedOnInit?: boolean | undefined;
}>>;
export type DatabaseConfig = z.infer<typeof DatabaseConfigSchema>;
export declare const AppConfigSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodString>;
    configVersion: z.ZodDefault<z.ZodNumber>;
    name: z.ZodDefault<z.ZodString>;
    description: z.ZodDefault<z.ZodString>;
    environment: z.ZodDefault<z.ZodEnum<["development", "staging", "production"]>>;
    resources: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    ui: z.ZodDefault<z.ZodObject<{
        theme: z.ZodDefault<z.ZodObject<{
            primaryColor: z.ZodDefault<z.ZodString>;
            fontFamily: z.ZodDefault<z.ZodString>;
            mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
            borderRadius: z.ZodDefault<z.ZodString>;
            customCss: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            primaryColor: string;
            fontFamily: string;
            mode: "light" | "dark" | "auto";
            borderRadius: string;
            customCss?: string | undefined;
        }, {
            primaryColor?: string | undefined;
            fontFamily?: string | undefined;
            mode?: "light" | "dark" | "auto" | undefined;
            borderRadius?: string | undefined;
            customCss?: string | undefined;
        }>>;
        navigation: z.ZodDefault<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            children: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<any, z.ZodTypeDef, any>>, "many">>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }, {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }>, "many">>;
        pages: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        layout: z.ZodDefault<z.ZodEnum<["sidebar", "topnav", "minimal"]>>;
        logo: z.ZodOptional<z.ZodString>;
        appName: z.ZodOptional<z.ZodString>;
        favicon: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        layout: "sidebar" | "topnav" | "minimal";
        theme: {
            primaryColor: string;
            fontFamily: string;
            mode: "light" | "dark" | "auto";
            borderRadius: string;
            customCss?: string | undefined;
        };
        navigation: {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }[];
        pages: z.objectOutputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        logo?: string | undefined;
        appName?: string | undefined;
        favicon?: string | undefined;
    }, {
        layout?: "sidebar" | "topnav" | "minimal" | undefined;
        theme?: {
            primaryColor?: string | undefined;
            fontFamily?: string | undefined;
            mode?: "light" | "dark" | "auto" | undefined;
            borderRadius?: string | undefined;
            customCss?: string | undefined;
        } | undefined;
        navigation?: {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }[] | undefined;
        pages?: z.objectInputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        logo?: string | undefined;
        appName?: string | undefined;
        favicon?: string | undefined;
    }>>;
    auth: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        providers: z.ZodDefault<z.ZodArray<z.ZodEnum<["email", "google", "github", "otp", "magic-link"]>, "many">>;
        roles: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            isDefault: z.ZodDefault<z.ZodBoolean>;
            isAdmin: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            permissions: string[];
            isDefault: boolean;
            isAdmin: boolean;
            label?: string | undefined;
        }, {
            name: string;
            label?: string | undefined;
            permissions?: string[] | undefined;
            isDefault?: boolean | undefined;
            isAdmin?: boolean | undefined;
        }>, "many">>;
        sessionDuration: z.ZodDefault<z.ZodNumber>;
        requireEmailVerification: z.ZodDefault<z.ZodBoolean>;
        allowRegistration: z.ZodDefault<z.ZodBoolean>;
        passwordPolicy: z.ZodDefault<z.ZodObject<{
            minLength: z.ZodDefault<z.ZodNumber>;
            requireUppercase: z.ZodDefault<z.ZodBoolean>;
            requireNumbers: z.ZodDefault<z.ZodBoolean>;
            requireSymbols: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            minLength: number;
            requireUppercase: boolean;
            requireNumbers: boolean;
            requireSymbols: boolean;
        }, {
            minLength?: number | undefined;
            requireUppercase?: boolean | undefined;
            requireNumbers?: boolean | undefined;
            requireSymbols?: boolean | undefined;
        }>>;
        redirectAfterLogin: z.ZodDefault<z.ZodString>;
        redirectAfterLogout: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        providers: ("email" | "google" | "github" | "otp" | "magic-link")[];
        roles: {
            name: string;
            permissions: string[];
            isDefault: boolean;
            isAdmin: boolean;
            label?: string | undefined;
        }[];
        sessionDuration: number;
        requireEmailVerification: boolean;
        allowRegistration: boolean;
        passwordPolicy: {
            minLength: number;
            requireUppercase: boolean;
            requireNumbers: boolean;
            requireSymbols: boolean;
        };
        redirectAfterLogin: string;
        redirectAfterLogout: string;
    }, {
        enabled?: boolean | undefined;
        providers?: ("email" | "google" | "github" | "otp" | "magic-link")[] | undefined;
        roles?: {
            name: string;
            label?: string | undefined;
            permissions?: string[] | undefined;
            isDefault?: boolean | undefined;
            isAdmin?: boolean | undefined;
        }[] | undefined;
        sessionDuration?: number | undefined;
        requireEmailVerification?: boolean | undefined;
        allowRegistration?: boolean | undefined;
        passwordPolicy?: {
            minLength?: number | undefined;
            requireUppercase?: boolean | undefined;
            requireNumbers?: boolean | undefined;
            requireSymbols?: boolean | undefined;
        } | undefined;
        redirectAfterLogin?: string | undefined;
        redirectAfterLogout?: string | undefined;
    }>>;
    api: z.ZodDefault<z.ZodObject<{
        prefix: z.ZodDefault<z.ZodString>;
        version: z.ZodDefault<z.ZodString>;
        rateLimit: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            windowMs: z.ZodDefault<z.ZodNumber>;
            max: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            max: number;
            enabled: boolean;
            windowMs: number;
        }, {
            max?: number | undefined;
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
        }>>;
        cors: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            origins: string[];
        }, {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
        }>>;
        pagination: z.ZodDefault<z.ZodObject<{
            defaultLimit: z.ZodDefault<z.ZodNumber>;
            maxLimit: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            defaultLimit: number;
            maxLimit: number;
        }, {
            defaultLimit?: number | undefined;
            maxLimit?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        prefix: string;
        rateLimit: {
            max: number;
            enabled: boolean;
            windowMs: number;
        };
        cors: {
            enabled: boolean;
            origins: string[];
        };
        pagination: {
            defaultLimit: number;
            maxLimit: number;
        };
    }, {
        version?: string | undefined;
        prefix?: string | undefined;
        rateLimit?: {
            max?: number | undefined;
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
        } | undefined;
        cors?: {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
        } | undefined;
        pagination?: {
            defaultLimit?: number | undefined;
            maxLimit?: number | undefined;
        } | undefined;
    }>>;
    database: z.ZodDefault<z.ZodObject<{
        provider: z.ZodDefault<z.ZodEnum<["postgresql", "mysql", "sqlite", "mongodb"]>>;
        migrationStrategy: z.ZodDefault<z.ZodEnum<["auto", "manual", "none"]>>;
        seedOnInit: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        provider: "postgresql" | "mysql" | "sqlite" | "mongodb";
        migrationStrategy: "auto" | "manual" | "none";
        seedOnInit: boolean;
    }, {
        provider?: "postgresql" | "mysql" | "sqlite" | "mongodb" | undefined;
        migrationStrategy?: "auto" | "manual" | "none" | undefined;
        seedOnInit?: boolean | undefined;
    }>>;
    i18n: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        defaultLocale: z.ZodDefault<z.ZodString>;
        supportedLocales: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        fallbackLocale: z.ZodDefault<z.ZodString>;
        translations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>>>;
        dateFormat: z.ZodDefault<z.ZodString>;
        numberFormat: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        defaultLocale: string;
        supportedLocales: string[];
        fallbackLocale: string;
        translations: Record<string, Record<string, string>>;
        dateFormat: string;
        numberFormat: string;
    }, {
        enabled?: boolean | undefined;
        defaultLocale?: string | undefined;
        supportedLocales?: string[] | undefined;
        fallbackLocale?: string | undefined;
        translations?: Record<string, Record<string, string>> | undefined;
        dateFormat?: string | undefined;
        numberFormat?: string | undefined;
    }>>;
    features: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        enabled: boolean;
        config: Record<string, unknown>;
        version?: string | undefined;
    }, {
        name: string;
        enabled?: boolean | undefined;
        config?: Record<string, unknown> | undefined;
        version?: string | undefined;
    }>, "many">>;
    plugins: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        config: Record<string, unknown>;
        path?: string | undefined;
    }, {
        name: string;
        path?: string | undefined;
        config?: Record<string, unknown> | undefined;
    }>, "many">>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    version: z.ZodDefault<z.ZodString>;
    configVersion: z.ZodDefault<z.ZodNumber>;
    name: z.ZodDefault<z.ZodString>;
    description: z.ZodDefault<z.ZodString>;
    environment: z.ZodDefault<z.ZodEnum<["development", "staging", "production"]>>;
    resources: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    ui: z.ZodDefault<z.ZodObject<{
        theme: z.ZodDefault<z.ZodObject<{
            primaryColor: z.ZodDefault<z.ZodString>;
            fontFamily: z.ZodDefault<z.ZodString>;
            mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
            borderRadius: z.ZodDefault<z.ZodString>;
            customCss: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            primaryColor: string;
            fontFamily: string;
            mode: "light" | "dark" | "auto";
            borderRadius: string;
            customCss?: string | undefined;
        }, {
            primaryColor?: string | undefined;
            fontFamily?: string | undefined;
            mode?: "light" | "dark" | "auto" | undefined;
            borderRadius?: string | undefined;
            customCss?: string | undefined;
        }>>;
        navigation: z.ZodDefault<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            children: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<any, z.ZodTypeDef, any>>, "many">>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }, {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }>, "many">>;
        pages: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        layout: z.ZodDefault<z.ZodEnum<["sidebar", "topnav", "minimal"]>>;
        logo: z.ZodOptional<z.ZodString>;
        appName: z.ZodOptional<z.ZodString>;
        favicon: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        layout: "sidebar" | "topnav" | "minimal";
        theme: {
            primaryColor: string;
            fontFamily: string;
            mode: "light" | "dark" | "auto";
            borderRadius: string;
            customCss?: string | undefined;
        };
        navigation: {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }[];
        pages: z.objectOutputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        logo?: string | undefined;
        appName?: string | undefined;
        favicon?: string | undefined;
    }, {
        layout?: "sidebar" | "topnav" | "minimal" | undefined;
        theme?: {
            primaryColor?: string | undefined;
            fontFamily?: string | undefined;
            mode?: "light" | "dark" | "auto" | undefined;
            borderRadius?: string | undefined;
            customCss?: string | undefined;
        } | undefined;
        navigation?: {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }[] | undefined;
        pages?: z.objectInputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        logo?: string | undefined;
        appName?: string | undefined;
        favicon?: string | undefined;
    }>>;
    auth: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        providers: z.ZodDefault<z.ZodArray<z.ZodEnum<["email", "google", "github", "otp", "magic-link"]>, "many">>;
        roles: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            isDefault: z.ZodDefault<z.ZodBoolean>;
            isAdmin: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            permissions: string[];
            isDefault: boolean;
            isAdmin: boolean;
            label?: string | undefined;
        }, {
            name: string;
            label?: string | undefined;
            permissions?: string[] | undefined;
            isDefault?: boolean | undefined;
            isAdmin?: boolean | undefined;
        }>, "many">>;
        sessionDuration: z.ZodDefault<z.ZodNumber>;
        requireEmailVerification: z.ZodDefault<z.ZodBoolean>;
        allowRegistration: z.ZodDefault<z.ZodBoolean>;
        passwordPolicy: z.ZodDefault<z.ZodObject<{
            minLength: z.ZodDefault<z.ZodNumber>;
            requireUppercase: z.ZodDefault<z.ZodBoolean>;
            requireNumbers: z.ZodDefault<z.ZodBoolean>;
            requireSymbols: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            minLength: number;
            requireUppercase: boolean;
            requireNumbers: boolean;
            requireSymbols: boolean;
        }, {
            minLength?: number | undefined;
            requireUppercase?: boolean | undefined;
            requireNumbers?: boolean | undefined;
            requireSymbols?: boolean | undefined;
        }>>;
        redirectAfterLogin: z.ZodDefault<z.ZodString>;
        redirectAfterLogout: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        providers: ("email" | "google" | "github" | "otp" | "magic-link")[];
        roles: {
            name: string;
            permissions: string[];
            isDefault: boolean;
            isAdmin: boolean;
            label?: string | undefined;
        }[];
        sessionDuration: number;
        requireEmailVerification: boolean;
        allowRegistration: boolean;
        passwordPolicy: {
            minLength: number;
            requireUppercase: boolean;
            requireNumbers: boolean;
            requireSymbols: boolean;
        };
        redirectAfterLogin: string;
        redirectAfterLogout: string;
    }, {
        enabled?: boolean | undefined;
        providers?: ("email" | "google" | "github" | "otp" | "magic-link")[] | undefined;
        roles?: {
            name: string;
            label?: string | undefined;
            permissions?: string[] | undefined;
            isDefault?: boolean | undefined;
            isAdmin?: boolean | undefined;
        }[] | undefined;
        sessionDuration?: number | undefined;
        requireEmailVerification?: boolean | undefined;
        allowRegistration?: boolean | undefined;
        passwordPolicy?: {
            minLength?: number | undefined;
            requireUppercase?: boolean | undefined;
            requireNumbers?: boolean | undefined;
            requireSymbols?: boolean | undefined;
        } | undefined;
        redirectAfterLogin?: string | undefined;
        redirectAfterLogout?: string | undefined;
    }>>;
    api: z.ZodDefault<z.ZodObject<{
        prefix: z.ZodDefault<z.ZodString>;
        version: z.ZodDefault<z.ZodString>;
        rateLimit: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            windowMs: z.ZodDefault<z.ZodNumber>;
            max: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            max: number;
            enabled: boolean;
            windowMs: number;
        }, {
            max?: number | undefined;
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
        }>>;
        cors: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            origins: string[];
        }, {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
        }>>;
        pagination: z.ZodDefault<z.ZodObject<{
            defaultLimit: z.ZodDefault<z.ZodNumber>;
            maxLimit: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            defaultLimit: number;
            maxLimit: number;
        }, {
            defaultLimit?: number | undefined;
            maxLimit?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        prefix: string;
        rateLimit: {
            max: number;
            enabled: boolean;
            windowMs: number;
        };
        cors: {
            enabled: boolean;
            origins: string[];
        };
        pagination: {
            defaultLimit: number;
            maxLimit: number;
        };
    }, {
        version?: string | undefined;
        prefix?: string | undefined;
        rateLimit?: {
            max?: number | undefined;
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
        } | undefined;
        cors?: {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
        } | undefined;
        pagination?: {
            defaultLimit?: number | undefined;
            maxLimit?: number | undefined;
        } | undefined;
    }>>;
    database: z.ZodDefault<z.ZodObject<{
        provider: z.ZodDefault<z.ZodEnum<["postgresql", "mysql", "sqlite", "mongodb"]>>;
        migrationStrategy: z.ZodDefault<z.ZodEnum<["auto", "manual", "none"]>>;
        seedOnInit: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        provider: "postgresql" | "mysql" | "sqlite" | "mongodb";
        migrationStrategy: "auto" | "manual" | "none";
        seedOnInit: boolean;
    }, {
        provider?: "postgresql" | "mysql" | "sqlite" | "mongodb" | undefined;
        migrationStrategy?: "auto" | "manual" | "none" | undefined;
        seedOnInit?: boolean | undefined;
    }>>;
    i18n: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        defaultLocale: z.ZodDefault<z.ZodString>;
        supportedLocales: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        fallbackLocale: z.ZodDefault<z.ZodString>;
        translations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>>>;
        dateFormat: z.ZodDefault<z.ZodString>;
        numberFormat: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        defaultLocale: string;
        supportedLocales: string[];
        fallbackLocale: string;
        translations: Record<string, Record<string, string>>;
        dateFormat: string;
        numberFormat: string;
    }, {
        enabled?: boolean | undefined;
        defaultLocale?: string | undefined;
        supportedLocales?: string[] | undefined;
        fallbackLocale?: string | undefined;
        translations?: Record<string, Record<string, string>> | undefined;
        dateFormat?: string | undefined;
        numberFormat?: string | undefined;
    }>>;
    features: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        enabled: boolean;
        config: Record<string, unknown>;
        version?: string | undefined;
    }, {
        name: string;
        enabled?: boolean | undefined;
        config?: Record<string, unknown> | undefined;
        version?: string | undefined;
    }>, "many">>;
    plugins: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        config: Record<string, unknown>;
        path?: string | undefined;
    }, {
        name: string;
        path?: string | undefined;
        config?: Record<string, unknown> | undefined;
    }>, "many">>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    version: z.ZodDefault<z.ZodString>;
    configVersion: z.ZodDefault<z.ZodNumber>;
    name: z.ZodDefault<z.ZodString>;
    description: z.ZodDefault<z.ZodString>;
    environment: z.ZodDefault<z.ZodEnum<["development", "staging", "production"]>>;
    resources: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
        name: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        pluralLabel: z.ZodOptional<z.ZodString>;
        icon: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            type: z.ZodDefault<z.ZodEnum<["text", "email", "password", "number", "boolean", "select", "multiselect", "date", "datetime", "textarea", "file", "image", "json", "relation", "uuid"]>>;
            required: z.ZodDefault<z.ZodBoolean>;
            unique: z.ZodDefault<z.ZodBoolean>;
            defaultValue: z.ZodOptional<z.ZodUnknown>;
            options: z.ZodOptional<z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>]>, "many">>;
            validation: z.ZodOptional<z.ZodArray<z.ZodObject<{
                type: z.ZodEnum<["required", "min", "max", "pattern", "email", "url", "custom"]>;
                value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                message: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }, {
                type: "email" | "custom" | "required" | "min" | "max" | "pattern" | "url";
                value?: string | number | boolean | undefined;
                message?: string | undefined;
            }>, "many">>;
            hidden: z.ZodDefault<z.ZodBoolean>;
            readonly: z.ZodDefault<z.ZodBoolean>;
            placeholder: z.ZodOptional<z.ZodString>;
            helpText: z.ZodOptional<z.ZodString>;
            relation: z.ZodOptional<z.ZodObject<{
                resource: z.ZodString;
                labelField: z.ZodDefault<z.ZodString>;
                valueField: z.ZodDefault<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                resource: string;
                labelField: string;
                valueField: string;
            }, {
                resource: string;
                labelField?: string | undefined;
                valueField?: string | undefined;
            }>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">;
        timestamps: z.ZodDefault<z.ZodBoolean>;
        softDelete: z.ZodDefault<z.ZodBoolean>;
        permissions: z.ZodOptional<z.ZodObject<{
            create: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            read: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            update: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            delete: z.ZodDefault<z.ZodUnion<[z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        }, "strip", z.ZodTypeAny, {
            create: boolean | string[];
            read: boolean | string[];
            update: boolean | string[];
            delete: boolean | string[];
        }, {
            create?: boolean | string[] | undefined;
            read?: boolean | string[] | undefined;
            update?: boolean | string[] | undefined;
            delete?: boolean | string[] | undefined;
        }>>;
        searchable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        sortable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        filterable: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        displayField: z.ZodOptional<z.ZodString>;
        hooks: z.ZodOptional<z.ZodObject<{
            beforeCreate: z.ZodOptional<z.ZodString>;
            afterCreate: z.ZodOptional<z.ZodString>;
            beforeUpdate: z.ZodOptional<z.ZodString>;
            afterUpdate: z.ZodOptional<z.ZodString>;
            beforeDelete: z.ZodOptional<z.ZodString>;
            afterDelete: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }, {
            beforeCreate?: string | undefined;
            afterCreate?: string | undefined;
            beforeUpdate?: string | undefined;
            afterUpdate?: string | undefined;
            beforeDelete?: string | undefined;
            afterDelete?: string | undefined;
        }>>;
    }, z.ZodTypeAny, "passthrough">>, "many">>;
    ui: z.ZodDefault<z.ZodObject<{
        theme: z.ZodDefault<z.ZodObject<{
            primaryColor: z.ZodDefault<z.ZodString>;
            fontFamily: z.ZodDefault<z.ZodString>;
            mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
            borderRadius: z.ZodDefault<z.ZodString>;
            customCss: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            primaryColor: string;
            fontFamily: string;
            mode: "light" | "dark" | "auto";
            borderRadius: string;
            customCss?: string | undefined;
        }, {
            primaryColor?: string | undefined;
            fontFamily?: string | undefined;
            mode?: "light" | "dark" | "auto" | undefined;
            borderRadius?: string | undefined;
            customCss?: string | undefined;
        }>>;
        navigation: z.ZodDefault<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            icon: z.ZodOptional<z.ZodString>;
            children: z.ZodOptional<z.ZodArray<z.ZodLazy<z.ZodType<any, z.ZodTypeDef, any>>, "many">>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }, {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }>, "many">>;
        pages: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, "passthrough", z.ZodTypeAny, z.objectOutputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">, z.objectInputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">>, "many">>;
        layout: z.ZodDefault<z.ZodEnum<["sidebar", "topnav", "minimal"]>>;
        logo: z.ZodOptional<z.ZodString>;
        appName: z.ZodOptional<z.ZodString>;
        favicon: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        layout: "sidebar" | "topnav" | "minimal";
        theme: {
            primaryColor: string;
            fontFamily: string;
            mode: "light" | "dark" | "auto";
            borderRadius: string;
            customCss?: string | undefined;
        };
        navigation: {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }[];
        pages: z.objectOutputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[];
        logo?: string | undefined;
        appName?: string | undefined;
        favicon?: string | undefined;
    }, {
        layout?: "sidebar" | "topnav" | "minimal" | undefined;
        theme?: {
            primaryColor?: string | undefined;
            fontFamily?: string | undefined;
            mode?: "light" | "dark" | "auto" | undefined;
            borderRadius?: string | undefined;
            customCss?: string | undefined;
        } | undefined;
        navigation?: {
            label: string;
            path?: string | undefined;
            i18nKey?: string | undefined;
            icon?: string | undefined;
            permissions?: string[] | undefined;
            children?: any[] | undefined;
        }[] | undefined;
        pages?: z.objectInputType<{
            id: z.ZodString;
            path: z.ZodString;
            title: z.ZodOptional<z.ZodString>;
            component: z.ZodDefault<z.ZodEnum<["form", "table", "dashboard", "detail", "kanban", "calendar", "chart", "custom"]>>;
            resource: z.ZodOptional<z.ZodString>;
            layout: z.ZodOptional<z.ZodString>;
            permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            i18nKey: z.ZodOptional<z.ZodString>;
        }, z.ZodTypeAny, "passthrough">[] | undefined;
        logo?: string | undefined;
        appName?: string | undefined;
        favicon?: string | undefined;
    }>>;
    auth: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        providers: z.ZodDefault<z.ZodArray<z.ZodEnum<["email", "google", "github", "otp", "magic-link"]>, "many">>;
        roles: z.ZodDefault<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            permissions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
            isDefault: z.ZodDefault<z.ZodBoolean>;
            isAdmin: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            permissions: string[];
            isDefault: boolean;
            isAdmin: boolean;
            label?: string | undefined;
        }, {
            name: string;
            label?: string | undefined;
            permissions?: string[] | undefined;
            isDefault?: boolean | undefined;
            isAdmin?: boolean | undefined;
        }>, "many">>;
        sessionDuration: z.ZodDefault<z.ZodNumber>;
        requireEmailVerification: z.ZodDefault<z.ZodBoolean>;
        allowRegistration: z.ZodDefault<z.ZodBoolean>;
        passwordPolicy: z.ZodDefault<z.ZodObject<{
            minLength: z.ZodDefault<z.ZodNumber>;
            requireUppercase: z.ZodDefault<z.ZodBoolean>;
            requireNumbers: z.ZodDefault<z.ZodBoolean>;
            requireSymbols: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            minLength: number;
            requireUppercase: boolean;
            requireNumbers: boolean;
            requireSymbols: boolean;
        }, {
            minLength?: number | undefined;
            requireUppercase?: boolean | undefined;
            requireNumbers?: boolean | undefined;
            requireSymbols?: boolean | undefined;
        }>>;
        redirectAfterLogin: z.ZodDefault<z.ZodString>;
        redirectAfterLogout: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        providers: ("email" | "google" | "github" | "otp" | "magic-link")[];
        roles: {
            name: string;
            permissions: string[];
            isDefault: boolean;
            isAdmin: boolean;
            label?: string | undefined;
        }[];
        sessionDuration: number;
        requireEmailVerification: boolean;
        allowRegistration: boolean;
        passwordPolicy: {
            minLength: number;
            requireUppercase: boolean;
            requireNumbers: boolean;
            requireSymbols: boolean;
        };
        redirectAfterLogin: string;
        redirectAfterLogout: string;
    }, {
        enabled?: boolean | undefined;
        providers?: ("email" | "google" | "github" | "otp" | "magic-link")[] | undefined;
        roles?: {
            name: string;
            label?: string | undefined;
            permissions?: string[] | undefined;
            isDefault?: boolean | undefined;
            isAdmin?: boolean | undefined;
        }[] | undefined;
        sessionDuration?: number | undefined;
        requireEmailVerification?: boolean | undefined;
        allowRegistration?: boolean | undefined;
        passwordPolicy?: {
            minLength?: number | undefined;
            requireUppercase?: boolean | undefined;
            requireNumbers?: boolean | undefined;
            requireSymbols?: boolean | undefined;
        } | undefined;
        redirectAfterLogin?: string | undefined;
        redirectAfterLogout?: string | undefined;
    }>>;
    api: z.ZodDefault<z.ZodObject<{
        prefix: z.ZodDefault<z.ZodString>;
        version: z.ZodDefault<z.ZodString>;
        rateLimit: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            windowMs: z.ZodDefault<z.ZodNumber>;
            max: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            max: number;
            enabled: boolean;
            windowMs: number;
        }, {
            max?: number | undefined;
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
        }>>;
        cors: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            origins: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            origins: string[];
        }, {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
        }>>;
        pagination: z.ZodDefault<z.ZodObject<{
            defaultLimit: z.ZodDefault<z.ZodNumber>;
            maxLimit: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            defaultLimit: number;
            maxLimit: number;
        }, {
            defaultLimit?: number | undefined;
            maxLimit?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        version: string;
        prefix: string;
        rateLimit: {
            max: number;
            enabled: boolean;
            windowMs: number;
        };
        cors: {
            enabled: boolean;
            origins: string[];
        };
        pagination: {
            defaultLimit: number;
            maxLimit: number;
        };
    }, {
        version?: string | undefined;
        prefix?: string | undefined;
        rateLimit?: {
            max?: number | undefined;
            enabled?: boolean | undefined;
            windowMs?: number | undefined;
        } | undefined;
        cors?: {
            enabled?: boolean | undefined;
            origins?: string[] | undefined;
        } | undefined;
        pagination?: {
            defaultLimit?: number | undefined;
            maxLimit?: number | undefined;
        } | undefined;
    }>>;
    database: z.ZodDefault<z.ZodObject<{
        provider: z.ZodDefault<z.ZodEnum<["postgresql", "mysql", "sqlite", "mongodb"]>>;
        migrationStrategy: z.ZodDefault<z.ZodEnum<["auto", "manual", "none"]>>;
        seedOnInit: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        provider: "postgresql" | "mysql" | "sqlite" | "mongodb";
        migrationStrategy: "auto" | "manual" | "none";
        seedOnInit: boolean;
    }, {
        provider?: "postgresql" | "mysql" | "sqlite" | "mongodb" | undefined;
        migrationStrategy?: "auto" | "manual" | "none" | undefined;
        seedOnInit?: boolean | undefined;
    }>>;
    i18n: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        defaultLocale: z.ZodDefault<z.ZodString>;
        supportedLocales: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        fallbackLocale: z.ZodDefault<z.ZodString>;
        translations: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodString>>>;
        dateFormat: z.ZodDefault<z.ZodString>;
        numberFormat: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        defaultLocale: string;
        supportedLocales: string[];
        fallbackLocale: string;
        translations: Record<string, Record<string, string>>;
        dateFormat: string;
        numberFormat: string;
    }, {
        enabled?: boolean | undefined;
        defaultLocale?: string | undefined;
        supportedLocales?: string[] | undefined;
        fallbackLocale?: string | undefined;
        translations?: Record<string, Record<string, string>> | undefined;
        dateFormat?: string | undefined;
        numberFormat?: string | undefined;
    }>>;
    features: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        enabled: z.ZodDefault<z.ZodBoolean>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        enabled: boolean;
        config: Record<string, unknown>;
        version?: string | undefined;
    }, {
        name: string;
        enabled?: boolean | undefined;
        config?: Record<string, unknown> | undefined;
        version?: string | undefined;
    }>, "many">>;
    plugins: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        config: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        config: Record<string, unknown>;
        path?: string | undefined;
    }, {
        name: string;
        path?: string | undefined;
        config?: Record<string, unknown> | undefined;
    }>, "many">>;
    metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.ZodTypeAny, "passthrough">>;
export type AppConfig = z.infer<typeof AppConfigSchema>;
export interface ConfigValidationResult {
    valid: boolean;
    errors: ConfigError[];
    warnings: ConfigWarning[];
    normalized: AppConfig;
}
export interface ConfigError {
    path: string;
    message: string;
    code: string;
    severity: "error" | "warning" | "info";
    value?: unknown;
}
export interface ConfigWarning {
    path: string;
    message: string;
    code: string;
}
//# sourceMappingURL=config.schema.d.ts.map