"use client";

import React, { useRef } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Loader2, CheckCircle, AlertCircle } from "lucide-react";

/* ── Admin Page Header ─────────────────────────────────────────── */
interface AdminPageHeaderProps {
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function AdminPageHeader({
  badge,
  title,
  titleAccent,
  subtitle,
  action,
  icon,
}: AdminPageHeaderProps) {
  return (
    <div className="admin-page-header">
      <div className="admin-page-header__left">
        {badge && (
          <div className="admin-page-header__badge">
            {icon}
            <span>{badge}</span>
          </div>
        )}
        <h1 className="admin-page-header__title">
          {title}{" "}
          {titleAccent && (
            <span className="admin-page-header__title-accent">{titleAccent}</span>
          )}
        </h1>
        <p className="admin-page-header__subtitle">{subtitle}</p>
      </div>
      {action && <div className="admin-page-header__action">{action}</div>}
    </div>
  );
}

/* ── Admin Card Container ───────────────────────────────────────── */
export function AdminCard({
  children,
  className = "",
  title,
  subtitle,
  action,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={`admin-card ${className}`}>
      {(title || action) && (
        <div className="admin-card__header">
          <div className="admin-card__header-text">
            {title && <h3 className="admin-card__title">{title}</h3>}
            {subtitle && <p className="admin-card__subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="admin-card__body">{children}</div>
    </div>
  );
}

/* ── Admin Modal ────────────────────────────────────────────────── */
interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  isSaving?: boolean;
  maxWidth?: "2xl" | "3xl" | "4xl";
  saveStatus?: "idle" | "saving" | "success" | "error";
  errorMsg?: string;
}

export function AdminModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = "Save Changes",
  isSaving = false,
  maxWidth = "3xl",
  saveStatus = "idle",
  errorMsg,
}: AdminModalProps) {
  if (!open || typeof window === "undefined") return null;

  const modalContent = (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className={`admin-modal-box admin-modal-box--${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="admin-modal-header">
          <div>
            <h2 className="admin-modal-header__title">{title}</h2>
            {subtitle && <p className="admin-modal-header__subtitle">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="admin-modal-close">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} style={{ display: "contents" }}>
          <div className="admin-modal-body">
            {children}

            {saveStatus === "error" && (
              <div className="admin-alert admin-alert--error">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg || "Failed to save. Please check your inputs."}</span>
              </div>
            )}
            {saveStatus === "success" && (
              <div className="admin-alert admin-alert--success">
                <CheckCircle size={16} style={{ flexShrink: 0 }} />
                <span>Successfully saved to database!</span>
              </div>
            )}
          </div>

          <div className="admin-modal-footer">
            <button type="button" onClick={onClose} className="admin-btn admin-btn--ghost">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="admin-btn admin-btn--primary"
            >
              {isSaving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              <span>{isSaving ? "Saving..." : submitLabel}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

/* ── Admin Form Field ───────────────────────────────────────────── */
interface AdminFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helperText?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function AdminField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  helperText,
  disabled,
}: AdminFieldProps) {
  return (
    <div className="admin-field">
      <div className="admin-field__label-row">
        <label className="admin-field__label">
          {label} {required && <span className="admin-field__required">*</span>}
        </label>
        {helperText && <span className="admin-field__helper">{helperText}</span>}
      </div>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="admin-field__input"
      />
    </div>
  );
}

/* ── Admin Date Field ───────────────────────────────────────────── */
interface AdminDateFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: any) => void;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
}

export function AdminDateField({
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  helperText,
}: AdminDateFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const openCalendar = () => {
    if (disabled) return;
    try {
      inputRef.current?.showPicker?.();
    } catch {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="admin-field">
      <div className="admin-field__label-row">
        <label className="admin-field__label">
          {label} {required && <span className="admin-field__required">*</span>}
        </label>
        {helperText ? (
          <span className="admin-field__helper">{helperText}</span>
        ) : !disabled ? (
          <span
            onClick={openCalendar}
            style={{
              fontSize: "11px",
              color: "#F5C542",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
              userSelect: "none",
            }}
          >
            📅 Open Calendar
          </span>
        ) : null}
      </div>

      <div
        onClick={openCalendar}
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          width: "100%",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "10px",
          padding: "10px 14px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.4 : 1,
          transition: "border-color 0.15s",
          gap: "8px",
        }}
      >
        <input
          ref={inputRef}
          type="date"
          name={name}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            try { (e.currentTarget as any).showPicker?.(); } catch {}
          }}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "#e8edf5",
            fontSize: "13px",
            fontWeight: 500,
            outline: "none",
            cursor: "pointer",
            colorScheme: "dark",
          }}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); openCalendar(); }}
          style={{
            padding: "4px",
            color: "#6b7a95",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          title="Open Calendar"
        >
          <Calendar size={16} />
        </button>
      </div>
    </div>
  );
}
