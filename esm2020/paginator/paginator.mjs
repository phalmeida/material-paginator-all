/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { coerceNumberProperty, coerceBooleanProperty, } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation, InjectionToken, Inject, Optional, Directive, } from '@angular/core';
import { MatPaginatorIntl } from './paginator-intl';
import { mixinInitialized, mixinDisabled, } from '@angular/material/core';
import * as i0 from "@angular/core";
import * as i1 from "./paginator-intl";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/button";
import * as i4 from "@angular/material/form-field";
import * as i5 from "@angular/material/select";
import * as i6 from "@angular/material/core";
import * as i7 from "@angular/material/tooltip";
/** The default page size if there is no page size and there are no provided page size options. */
const DEFAULT_PAGE_SIZE = 50;
/**
 * Change event object that is emitted when the user selects a
 * different page size or navigates to another page.
 */
export class PageEvent {
}
/** Injection token that can be used to provide the default options for the paginator module. */
export const MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken('MAT_PAGINATOR_DEFAULT_OPTIONS');
// Boilerplate for applying mixins to _MatPaginatorBase.
/** @docs-private */
const _MatPaginatorMixinBase = mixinDisabled(mixinInitialized(class {
}));
/**
 * Base class with all of the `MatPaginator` functionality.
 * @docs-private
 */
export class _MatPaginatorBase extends _MatPaginatorMixinBase {
    constructor(_intl, _changeDetectorRef, defaults) {
        super();
        this._intl = _intl;
        this._changeDetectorRef = _changeDetectorRef;
        this._pageIndex = 0;
        this._length = 0;
        this._pageSizeOptions = [];
        this._hidePageSize = false;
        this._showFirstLastButtons = false;
        /** Used to configure the underlying `MatSelect` inside the paginator. */
        this.selectConfig = {};
        /** Event emitted when the paginator changes the page size or page index. */
        this.page = new EventEmitter();
        this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
        if (defaults) {
            const { pageSize, pageSizeOptions, hidePageSize, showFirstLastButtons } = defaults;
            if (pageSize != null) {
                this._pageSize = pageSize;
            }
            if (pageSizeOptions != null) {
                this._pageSizeOptions = pageSizeOptions;
            }
            if (hidePageSize != null) {
                this._hidePageSize = hidePageSize;
            }
            if (showFirstLastButtons != null) {
                this._showFirstLastButtons = showFirstLastButtons;
            }
        }
    }
    /** The zero-based page index of the displayed list of items. Defaulted to 0. */
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = Math.max(coerceNumberProperty(value), 0);
        this._changeDetectorRef.markForCheck();
    }
    /** The length of the total number of items that are being paginated. Defaulted to 0. */
    get length() {
        return this._length;
    }
    set length(value) {
        this._length = coerceNumberProperty(value);
        this._changeDetectorRef.markForCheck();
    }
    /** Number of items to display on a page. By default set to 50. */
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(value) {
        this._pageSize = Math.max(coerceNumberProperty(value), 0);
        this._updateDisplayedPageSizeOptions();
    }
    /** The set of provided page size options to display to the user. */
    get pageSizeOptions() {
        return this._pageSizeOptions;
    }
    set pageSizeOptions(value) {
        this._pageSizeOptions = (value || []).map(p => typeof p === 'object' && p !== null
            ? { label: p.label, value: coerceNumberProperty(p.value) }
            : coerceNumberProperty(p));
        this._updateDisplayedPageSizeOptions();
    }
    /** Whether to hide the page size selection UI from the user. */
    get hidePageSize() {
        return this._hidePageSize;
    }
    set hidePageSize(value) {
        this._hidePageSize = coerceBooleanProperty(value);
    }
    /** Whether to show the first/last buttons UI to the user. */
    get showFirstLastButtons() {
        return this._showFirstLastButtons;
    }
    set showFirstLastButtons(value) {
        this._showFirstLastButtons = coerceBooleanProperty(value);
    }
    ngOnInit() {
        this._initialized = true;
        this._updateDisplayedPageSizeOptions();
        this._markInitialized();
    }
    ngOnDestroy() {
        this._intlChanges.unsubscribe();
    }
    /** Advances to the next page if it exists. */
    nextPage() {
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.pageIndex + 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move back to the previous page if it exists. */
    previousPage() {
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.pageIndex - 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the first page if not already there. */
    firstPage() {
        // hasPreviousPage being false implies at the start
        if (!this.hasPreviousPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = 0;
        this._emitPageEvent(previousPageIndex);
    }
    /** Move to the last page if not already there. */
    lastPage() {
        // hasNextPage being false implies at the end
        if (!this.hasNextPage()) {
            return;
        }
        const previousPageIndex = this.pageIndex;
        this.pageIndex = this.getNumberOfPages() - 1;
        this._emitPageEvent(previousPageIndex);
    }
    /** Whether there is a previous page. */
    hasPreviousPage() {
        return this.pageIndex >= 1 && this.pageSize != 0;
    }
    /** Whether there is a next page. */
    hasNextPage() {
        const maxPageIndex = this.getNumberOfPages() - 1;
        return this.pageIndex < maxPageIndex && this.pageSize != 0;
    }
    /** Calculate the number of pages */
    getNumberOfPages() {
        if (!this.pageSize) {
            return 0;
        }
        return Math.ceil(this.length / this.pageSize);
    }
    /**
     * Changes the page size so that the first item displayed on the page will still be
     * displayed using the new page size.
     *
     * For example, if the page size is 10 and on the second page (items indexed 10-19) then
     * switching so that the page size is 5 will set the third page as the current page so
     * that the 10th item will still be displayed.
     */
    _changePageSize(pageSize) {
        // Current page needs to be updated to reflect the new page size. Navigate to the page
        // containing the previous page's first item.
        const startIndex = this.pageIndex * this.pageSize;
        const previousPageIndex = this.pageIndex;
        this.pageIndex = Math.floor(startIndex / pageSize) || 0;
        this.pageSize = pageSize;
        this._emitPageEvent(previousPageIndex);
    }
    /** Checks whether the buttons for going forwards should be disabled. */
    _nextButtonsDisabled() {
        return this.disabled || !this.hasNextPage();
    }
    /** Checks whether the buttons for going backwards should be disabled. */
    _previousButtonsDisabled() {
        return this.disabled || !this.hasPreviousPage();
    }
    /**
     * Updates the list of page size options to display to the user. Includes making sure that
     * the page size is an option and that the list is sorted.
     */
    _updateDisplayedPageSizeOptions() {
        if (!this._initialized) {
            return;
        }
        // If no page size is provided, use the first page size option or the default page size.
        if (!this.pageSize) {
            const pageSize = this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
            this._pageSize = typeof pageSize === 'number' ? pageSize : pageSize.value;
        }
        this._displayedPageSizeOptions = this.pageSizeOptions.map(pageSize => {
            if (typeof pageSize === 'number') {
                return { value: pageSize, label: `${pageSize}` };
            }
            return pageSize;
        });
        if (!this._displayedPageSizeOptions.some(x => x.value === this.pageSize)) {
            this._displayedPageSizeOptions.push({ value: this.pageSize, label: `${this.pageSize}` });
        }
        // Sort the numbers using a number-specific sort function.
        this._displayedPageSizeOptions.sort((a, b) => a.value - b.value);
        this._changeDetectorRef.markForCheck();
    }
    /** Emits an event notifying that a change of the paginator's properties has been triggered. */
    _emitPageEvent(previousPageIndex) {
        this.page.emit({
            previousPageIndex,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            length: this.length,
        });
    }
}
_MatPaginatorBase.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatPaginatorBase, deps: "invalid", target: i0.ɵɵFactoryTarget.Directive });
_MatPaginatorBase.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: _MatPaginatorBase, inputs: { color: "color", pageIndex: "pageIndex", length: "length", pageSize: "pageSize", pageSizeOptions: "pageSizeOptions", hidePageSize: "hidePageSize", showFirstLastButtons: "showFirstLastButtons", selectConfig: "selectConfig" }, outputs: { page: "page" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: _MatPaginatorBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.MatPaginatorIntl }, { type: i0.ChangeDetectorRef }, { type: undefined }]; }, propDecorators: { color: [{
                type: Input
            }], pageIndex: [{
                type: Input
            }], length: [{
                type: Input
            }], pageSize: [{
                type: Input
            }], pageSizeOptions: [{
                type: Input
            }], hidePageSize: [{
                type: Input
            }], showFirstLastButtons: [{
                type: Input
            }], selectConfig: [{
                type: Input
            }], page: [{
                type: Output
            }] } });
/**
 * Component to provide navigation between paged information. Displays the size of the current
 * page, user-selectable options to change that size, what items are being shown, and
 * navigational button to go to the previous or next page.
 */
export class MatPaginator extends _MatPaginatorBase {
    constructor(intl, changeDetectorRef, defaults) {
        super(intl, changeDetectorRef, defaults);
        if (defaults && defaults.formFieldAppearance != null) {
            this._formFieldAppearance = defaults.formFieldAppearance;
        }
    }
}
MatPaginator.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginator, deps: [{ token: i1.MatPaginatorIntl }, { token: i0.ChangeDetectorRef }, { token: MAT_PAGINATOR_DEFAULT_OPTIONS, optional: true }], target: i0.ɵɵFactoryTarget.Component });
MatPaginator.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "14.0.1", type: MatPaginator, selector: "mat-paginator", inputs: { disabled: "disabled" }, host: { attributes: { "role": "group" }, classAttribute: "mat-paginator" }, exportAs: ["matPaginator"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [panelClass]=\"selectConfig.panelClass || ''\"\n          [disableOptionCentering]=\"selectConfig.disableOptionCentering\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption.value\">\n            {{pageSizeOption.label}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-paginator-icon{fill:CanvasText}"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.MatButton, selector: "button[mat-button], button[mat-raised-button], button[mat-icon-button],             button[mat-fab], button[mat-mini-fab], button[mat-stroked-button],             button[mat-flat-button]", inputs: ["disabled", "disableRipple", "color"], exportAs: ["matButton"] }, { kind: "component", type: i4.MatFormField, selector: "mat-form-field", inputs: ["color", "appearance", "hideRequiredMarker", "hintLabel", "floatLabel"], exportAs: ["matFormField"] }, { kind: "component", type: i5.MatSelect, selector: "mat-select", inputs: ["disabled", "disableRipple", "tabIndex"], exportAs: ["matSelect"] }, { kind: "component", type: i6.MatOption, selector: "mat-option", exportAs: ["matOption"] }, { kind: "directive", type: i7.MatTooltip, selector: "[matTooltip]", exportAs: ["matTooltip"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MatPaginator, decorators: [{
            type: Component,
            args: [{ selector: 'mat-paginator', exportAs: 'matPaginator', inputs: ['disabled'], host: {
                        'class': 'mat-paginator',
                        'role': 'group',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, template: "<div class=\"mat-paginator-outer-container\">\n  <div class=\"mat-paginator-container\">\n    <div class=\"mat-paginator-page-size\" *ngIf=\"!hidePageSize\">\n      <div class=\"mat-paginator-page-size-label\">\n        {{_intl.itemsPerPageLabel}}\n      </div>\n\n      <mat-form-field\n        *ngIf=\"_displayedPageSizeOptions.length > 1\"\n        [appearance]=\"_formFieldAppearance!\"\n        [color]=\"color\"\n        class=\"mat-paginator-page-size-select\">\n        <mat-select\n          [value]=\"pageSize\"\n          [disabled]=\"disabled\"\n          [panelClass]=\"selectConfig.panelClass || ''\"\n          [disableOptionCentering]=\"selectConfig.disableOptionCentering\"\n          [aria-label]=\"_intl.itemsPerPageLabel\"\n          (selectionChange)=\"_changePageSize($event.value)\">\n          <mat-option *ngFor=\"let pageSizeOption of _displayedPageSizeOptions\" [value]=\"pageSizeOption.value\">\n            {{pageSizeOption.label}}\n          </mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <div\n        class=\"mat-paginator-page-size-value\"\n        *ngIf=\"_displayedPageSizeOptions.length <= 1\">{{pageSize}}</div>\n    </div>\n\n    <div class=\"mat-paginator-range-actions\">\n      <div class=\"mat-paginator-range-label\">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-first\"\n              (click)=\"firstPage()\"\n              [attr.aria-label]=\"_intl.firstPageLabel\"\n              [matTooltip]=\"_intl.firstPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-previous\"\n              (click)=\"previousPage()\"\n              [attr.aria-label]=\"_intl.previousPageLabel\"\n              [matTooltip]=\"_intl.previousPageLabel\"\n              [matTooltipDisabled]=\"_previousButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_previousButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-next\"\n              (click)=\"nextPage()\"\n              [attr.aria-label]=\"_intl.nextPageLabel\"\n              [matTooltip]=\"_intl.nextPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z\"/>\n        </svg>\n      </button>\n      <button mat-icon-button type=\"button\"\n              class=\"mat-paginator-navigation-last\"\n              (click)=\"lastPage()\"\n              [attr.aria-label]=\"_intl.lastPageLabel\"\n              [matTooltip]=\"_intl.lastPageLabel\"\n              [matTooltipDisabled]=\"_nextButtonsDisabled()\"\n              [matTooltipPosition]=\"'above'\"\n              [disabled]=\"_nextButtonsDisabled()\"\n              *ngIf=\"showFirstLastButtons\">\n        <svg class=\"mat-paginator-icon\" viewBox=\"0 0 24 24\" focusable=\"false\">\n          <path d=\"M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>\n</div>\n", styles: [".mat-paginator{display:block}.mat-paginator-outer-container{display:flex}.mat-paginator-container{display:flex;align-items:center;justify-content:flex-end;padding:0 8px;flex-wrap:wrap-reverse;width:100%}.mat-paginator-page-size{display:flex;align-items:baseline;margin-right:8px}[dir=rtl] .mat-paginator-page-size{margin-right:0;margin-left:8px}.mat-paginator-page-size-label{margin:0 4px}.mat-paginator-page-size-select{margin:6px 4px 0 4px;width:56px}.mat-paginator-page-size-select.mat-form-field-appearance-outline{width:64px}.mat-paginator-page-size-select.mat-form-field-appearance-fill{width:64px}.mat-paginator-range-label{margin:0 32px 0 24px}.mat-paginator-range-actions{display:flex;align-items:center}.mat-paginator-icon{width:28px;fill:currentColor}[dir=rtl] .mat-paginator-icon{transform:rotate(180deg)}.cdk-high-contrast-active .mat-paginator-icon{fill:CanvasText}"] }]
        }], ctorParameters: function () { return [{ type: i1.MatPaginatorIntl }, { type: i0.ChangeDetectorRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_PAGINATOR_DEFAULT_OPTIONS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3BhZ2luYXRvci9wYWdpbmF0b3IudHMiLCIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvcGFnaW5hdG9yL3BhZ2luYXRvci5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIscUJBQXFCLEdBR3RCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsTUFBTSxFQUNOLFFBQVEsRUFDUixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDbEQsT0FBTyxFQUVMLGdCQUFnQixFQUVoQixhQUFhLEdBRWQsTUFBTSx3QkFBd0IsQ0FBQzs7Ozs7Ozs7O0FBR2hDLGtHQUFrRztBQUNsRyxNQUFNLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUU3Qjs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sU0FBUztDQWVyQjtBQXlCRCxnR0FBZ0c7QUFDaEcsTUFBTSxDQUFDLE1BQU0sNkJBQTZCLEdBQUcsSUFBSSxjQUFjLENBQzdELCtCQUErQixDQUNoQyxDQUFDO0FBRUYsd0RBQXdEO0FBQ3hELG9CQUFvQjtBQUNwQixNQUFNLHNCQUFzQixHQUFHLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztDQUFRLENBQUMsQ0FBQyxDQUFDO0FBV3pFOzs7R0FHRztBQUVILE1BQU0sT0FBZ0IsaUJBUXBCLFNBQVEsc0JBQXNCO0lBc0Y5QixZQUNTLEtBQXVCLEVBQ3RCLGtCQUFxQyxFQUM3QyxRQUFZO1FBRVosS0FBSyxFQUFFLENBQUM7UUFK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Iiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIGNvZXJjZU51bWJlclByb3BlcnR5LFxuICBjb2VyY2VCb29sZWFuUHJvcGVydHksXG4gIEJvb2xlYW5JbnB1dCxcbiAgTnVtYmVySW5wdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgVmlld0VuY2Fwc3VsYXRpb24sXG4gIEluamVjdGlvblRva2VuLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBEaXJlY3RpdmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtNYXRQYWdpbmF0b3JJbnRsfSBmcm9tICcuL3BhZ2luYXRvci1pbnRsJztcbmltcG9ydCB7XG4gIEhhc0luaXRpYWxpemVkLFxuICBtaXhpbkluaXRpYWxpemVkLFxuICBUaGVtZVBhbGV0dGUsXG4gIG1peGluRGlzYWJsZWQsXG4gIENhbkRpc2FibGUsXG59IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHtNYXRGb3JtRmllbGRBcHBlYXJhbmNlfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9mb3JtLWZpZWxkJztcblxuLyoqIFRoZSBkZWZhdWx0IHBhZ2Ugc2l6ZSBpZiB0aGVyZSBpcyBubyBwYWdlIHNpemUgYW5kIHRoZXJlIGFyZSBubyBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucy4gKi9cbmNvbnN0IERFRkFVTFRfUEFHRV9TSVpFID0gNTA7XG5cbi8qKlxuICogQ2hhbmdlIGV2ZW50IG9iamVjdCB0aGF0IGlzIGVtaXR0ZWQgd2hlbiB0aGUgdXNlciBzZWxlY3RzIGFcbiAqIGRpZmZlcmVudCBwYWdlIHNpemUgb3IgbmF2aWdhdGVzIHRvIGFub3RoZXIgcGFnZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFBhZ2VFdmVudCB7XG4gIC8qKiBUaGUgY3VycmVudCBwYWdlIGluZGV4LiAqL1xuICBwYWdlSW5kZXg6IG51bWJlcjtcblxuICAvKipcbiAgICogSW5kZXggb2YgdGhlIHBhZ2UgdGhhdCB3YXMgc2VsZWN0ZWQgcHJldmlvdXNseS5cbiAgICogQGJyZWFraW5nLWNoYW5nZSA4LjAuMCBUbyBiZSBtYWRlIGludG8gYSByZXF1aXJlZCBwcm9wZXJ0eS5cbiAgICovXG4gIHByZXZpb3VzUGFnZUluZGV4PzogbnVtYmVyO1xuXG4gIC8qKiBUaGUgY3VycmVudCBwYWdlIHNpemUgKi9cbiAgcGFnZVNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIGN1cnJlbnQgdG90YWwgbnVtYmVyIG9mIGl0ZW1zIGJlaW5nIHBhZ2VkICovXG4gIGxlbmd0aDogbnVtYmVyO1xufVxuXG4vKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuZXhwb3J0IHR5cGUgUGFnZVNpemVPcHRpb25zID1cbiAgfCByZWFkb25seSAobnVtYmVyIHwge3ZhbHVlOiBudW1iZXI7IGxhYmVsOiBzdHJpbmd9KVtdXG4gIHwgKG51bWJlciB8IHt2YWx1ZTogbnVtYmVyOyBsYWJlbDogc3RyaW5nfSlbXTtcblxuLyoqIE9iamVjdCB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGFnaW5hdG9yIG1vZHVsZS4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UGFnaW5hdG9yRGVmYXVsdE9wdGlvbnMge1xuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgcGFnZVNpemU/OiBudW1iZXI7XG5cbiAgLyoqIFRoZSBzZXQgb2YgcHJvdmlkZWQgcGFnZSBzaXplIG9wdGlvbnMgdG8gZGlzcGxheSB0byB0aGUgdXNlci4gKi9cbiAgcGFnZVNpemVPcHRpb25zPzogKG51bWJlciB8IHt2YWx1ZTogbnVtYmVyOyBsYWJlbDogc3RyaW5nfSlbXTtcblxuICAvKiogV2hldGhlciB0byBoaWRlIHRoZSBwYWdlIHNpemUgc2VsZWN0aW9uIFVJIGZyb20gdGhlIHVzZXIuICovXG4gIGhpZGVQYWdlU2l6ZT86IGJvb2xlYW47XG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyB0aGUgZmlyc3QvbGFzdCBidXR0b25zIFVJIHRvIHRoZSB1c2VyLiAqL1xuICBzaG93Rmlyc3RMYXN0QnV0dG9ucz86IGJvb2xlYW47XG5cbiAgLyoqIFRoZSBkZWZhdWx0IGZvcm0tZmllbGQgYXBwZWFyYW5jZSB0byBhcHBseSB0byB0aGUgcGFnZSBzaXplIG9wdGlvbnMgc2VsZWN0b3IuICovXG4gIGZvcm1GaWVsZEFwcGVhcmFuY2U/OiBNYXRGb3JtRmllbGRBcHBlYXJhbmNlO1xufVxuXG4vKiogSW5qZWN0aW9uIHRva2VuIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGFnaW5hdG9yIG1vZHVsZS4gKi9cbmV4cG9ydCBjb25zdCBNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUyA9IG5ldyBJbmplY3Rpb25Ub2tlbjxNYXRQYWdpbmF0b3JEZWZhdWx0T3B0aW9ucz4oXG4gICdNQVRfUEFHSU5BVE9SX0RFRkFVTFRfT1BUSU9OUycsXG4pO1xuXG4vLyBCb2lsZXJwbGF0ZSBmb3IgYXBwbHlpbmcgbWl4aW5zIHRvIF9NYXRQYWdpbmF0b3JCYXNlLlxuLyoqIEBkb2NzLXByaXZhdGUgKi9cbmNvbnN0IF9NYXRQYWdpbmF0b3JNaXhpbkJhc2UgPSBtaXhpbkRpc2FibGVkKG1peGluSW5pdGlhbGl6ZWQoY2xhc3Mge30pKTtcblxuLyoqIE9iamVjdCB0aGF0IGNhbiB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgdW5kZXJseWluZyBgTWF0U2VsZWN0YCBpbnNpZGUgYSBgTWF0UGFnaW5hdG9yYC4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWF0UGFnaW5hdG9yU2VsZWN0Q29uZmlnIHtcbiAgLyoqIFdoZXRoZXIgdG8gY2VudGVyIHRoZSBhY3RpdmUgb3B0aW9uIG92ZXIgdGhlIHRyaWdnZXIuICovXG4gIGRpc2FibGVPcHRpb25DZW50ZXJpbmc/OiBib29sZWFuO1xuXG4gIC8qKiBDbGFzc2VzIHRvIGJlIHBhc3NlZCB0byB0aGUgc2VsZWN0IHBhbmVsLiAqL1xuICBwYW5lbENsYXNzPzogc3RyaW5nIHwgc3RyaW5nW10gfCBTZXQ8c3RyaW5nPiB8IHtba2V5OiBzdHJpbmddOiBhbnl9O1xufVxuXG4vKipcbiAqIEJhc2UgY2xhc3Mgd2l0aCBhbGwgb2YgdGhlIGBNYXRQYWdpbmF0b3JgIGZ1bmN0aW9uYWxpdHkuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbkBEaXJlY3RpdmUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRQYWdpbmF0b3JCYXNlPFxuICAgIE8gZXh0ZW5kcyB7XG4gICAgICBwYWdlU2l6ZT86IG51bWJlcjtcbiAgICAgIHBhZ2VTaXplT3B0aW9ucz86IChudW1iZXIgfCB7dmFsdWU6IG51bWJlcjsgbGFiZWw6IHN0cmluZ30pW107XG4gICAgICBoaWRlUGFnZVNpemU/OiBib29sZWFuO1xuICAgICAgc2hvd0ZpcnN0TGFzdEJ1dHRvbnM/OiBib29sZWFuO1xuICAgIH0sXG4gID5cbiAgZXh0ZW5kcyBfTWF0UGFnaW5hdG9yTWl4aW5CYXNlXG4gIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIENhbkRpc2FibGUsIEhhc0luaXRpYWxpemVkXG57XG4gIHByaXZhdGUgX2luaXRpYWxpemVkOiBib29sZWFuO1xuICBwcml2YXRlIF9pbnRsQ2hhbmdlczogU3Vic2NyaXB0aW9uO1xuXG4gIC8qKiBUaGVtZSBjb2xvciB0byBiZSB1c2VkIGZvciB0aGUgdW5kZXJseWluZyBmb3JtIGNvbnRyb2xzLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlO1xuXG4gIC8qKiBUaGUgemVyby1iYXNlZCBwYWdlIGluZGV4IG9mIHRoZSBkaXNwbGF5ZWQgbGlzdCBvZiBpdGVtcy4gRGVmYXVsdGVkIHRvIDAuICovXG4gIEBJbnB1dCgpXG4gIGdldCBwYWdlSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fcGFnZUluZGV4O1xuICB9XG4gIHNldCBwYWdlSW5kZXgodmFsdWU6IE51bWJlcklucHV0KSB7XG4gICAgdGhpcy5fcGFnZUluZGV4ID0gTWF0aC5tYXgoY29lcmNlTnVtYmVyUHJvcGVydHkodmFsdWUpLCAwKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuICBwcml2YXRlIF9wYWdlSW5kZXggPSAwO1xuXG4gIC8qKiBUaGUgbGVuZ3RoIG9mIHRoZSB0b3RhbCBudW1iZXIgb2YgaXRlbXMgdGhhdCBhcmUgYmVpbmcgcGFnaW5hdGVkLiBEZWZhdWx0ZWQgdG8gMC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGxlbmd0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9sZW5ndGg7XG4gIH1cbiAgc2V0IGxlbmd0aCh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9sZW5ndGggPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cbiAgcHJpdmF0ZSBfbGVuZ3RoID0gMDtcblxuICAvKiogTnVtYmVyIG9mIGl0ZW1zIHRvIGRpc3BsYXkgb24gYSBwYWdlLiBCeSBkZWZhdWx0IHNldCB0byA1MC4gKi9cbiAgQElucHV0KClcbiAgZ2V0IHBhZ2VTaXplKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX3BhZ2VTaXplO1xuICB9XG4gIHNldCBwYWdlU2l6ZSh2YWx1ZTogTnVtYmVySW5wdXQpIHtcbiAgICB0aGlzLl9wYWdlU2l6ZSA9IE1hdGgubWF4KGNvZXJjZU51bWJlclByb3BlcnR5KHZhbHVlKSwgMCk7XG4gICAgdGhpcy5fdXBkYXRlRGlzcGxheWVkUGFnZVNpemVPcHRpb25zKCk7XG4gIH1cbiAgcHJpdmF0ZSBfcGFnZVNpemU6IG51bWJlcjtcblxuICAvKiogVGhlIHNldCBvZiBwcm92aWRlZCBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgcGFnZVNpemVPcHRpb25zKCk6IChudW1iZXIgfCB7dmFsdWU6IG51bWJlcjsgbGFiZWw6IHN0cmluZ30pW10ge1xuICAgIHJldHVybiB0aGlzLl9wYWdlU2l6ZU9wdGlvbnM7XG4gIH1cbiAgc2V0IHBhZ2VTaXplT3B0aW9ucyh2YWx1ZTogUGFnZVNpemVPcHRpb25zKSB7XG4gICAgdGhpcy5fcGFnZVNpemVPcHRpb25zID0gKHZhbHVlIHx8IFtdKS5tYXAocCA9PlxuICAgICAgdHlwZW9mIHAgPT09ICdvYmplY3QnICYmIHAgIT09IG51bGxcbiAgICAgICAgPyB7bGFiZWw6IHAubGFiZWwsIHZhbHVlOiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShwLnZhbHVlKX1cbiAgICAgICAgOiBjb2VyY2VOdW1iZXJQcm9wZXJ0eShwKSxcbiAgICApO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICB9XG4gIHByaXZhdGUgX3BhZ2VTaXplT3B0aW9uczogKG51bWJlciB8IHt2YWx1ZTogbnVtYmVyOyBsYWJlbDogc3RyaW5nfSlbXSA9IFtdO1xuXG4gIC8qKiBXaGV0aGVyIHRvIGhpZGUgdGhlIHBhZ2Ugc2l6ZSBzZWxlY3Rpb24gVUkgZnJvbSB0aGUgdXNlci4gKi9cbiAgQElucHV0KClcbiAgZ2V0IGhpZGVQYWdlU2l6ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5faGlkZVBhZ2VTaXplO1xuICB9XG4gIHNldCBoaWRlUGFnZVNpemUodmFsdWU6IEJvb2xlYW5JbnB1dCkge1xuICAgIHRoaXMuX2hpZGVQYWdlU2l6ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG4gIH1cbiAgcHJpdmF0ZSBfaGlkZVBhZ2VTaXplID0gZmFsc2U7XG5cbiAgLyoqIFdoZXRoZXIgdG8gc2hvdyB0aGUgZmlyc3QvbGFzdCBidXR0b25zIFVJIHRvIHRoZSB1c2VyLiAqL1xuICBASW5wdXQoKVxuICBnZXQgc2hvd0ZpcnN0TGFzdEJ1dHRvbnMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Nob3dGaXJzdExhc3RCdXR0b25zO1xuICB9XG4gIHNldCBzaG93Rmlyc3RMYXN0QnV0dG9ucyh2YWx1ZTogQm9vbGVhbklucHV0KSB7XG4gICAgdGhpcy5fc2hvd0ZpcnN0TGFzdEJ1dHRvbnMgPSBjb2VyY2VCb29sZWFuUHJvcGVydHkodmFsdWUpO1xuICB9XG4gIHByaXZhdGUgX3Nob3dGaXJzdExhc3RCdXR0b25zID0gZmFsc2U7XG5cbiAgLyoqIFVzZWQgdG8gY29uZmlndXJlIHRoZSB1bmRlcmx5aW5nIGBNYXRTZWxlY3RgIGluc2lkZSB0aGUgcGFnaW5hdG9yLiAqL1xuICBASW5wdXQoKSBzZWxlY3RDb25maWc6IE1hdFBhZ2luYXRvclNlbGVjdENvbmZpZyA9IHt9O1xuXG4gIC8qKiBFdmVudCBlbWl0dGVkIHdoZW4gdGhlIHBhZ2luYXRvciBjaGFuZ2VzIHRoZSBwYWdlIHNpemUgb3IgcGFnZSBpbmRleC4gKi9cbiAgQE91dHB1dCgpIHJlYWRvbmx5IHBhZ2U6IEV2ZW50RW1pdHRlcjxQYWdlRXZlbnQ+ID0gbmV3IEV2ZW50RW1pdHRlcjxQYWdlRXZlbnQ+KCk7XG5cbiAgLyoqIERpc3BsYXllZCBzZXQgb2YgcGFnZSBzaXplIG9wdGlvbnMuIFdpbGwgYmUgc29ydGVkIGFuZCBpbmNsdWRlIGN1cnJlbnQgcGFnZSBzaXplLiAqL1xuICBfZGlzcGxheWVkUGFnZVNpemVPcHRpb25zOiB7dmFsdWU6IG51bWJlcjsgbGFiZWw6IHN0cmluZ31bXTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgX2ludGw6IE1hdFBhZ2luYXRvckludGwsXG4gICAgcHJpdmF0ZSBfY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIGRlZmF1bHRzPzogTyxcbiAgKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9pbnRsQ2hhbmdlcyA9IF9pbnRsLmNoYW5nZXMuc3Vic2NyaWJlKCgpID0+IHRoaXMuX2NoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpKTtcblxuICAgIGlmIChkZWZhdWx0cykge1xuICAgICAgY29uc3Qge3BhZ2VTaXplLCBwYWdlU2l6ZU9wdGlvbnMsIGhpZGVQYWdlU2l6ZSwgc2hvd0ZpcnN0TGFzdEJ1dHRvbnN9ID0gZGVmYXVsdHM7XG5cbiAgICAgIGlmIChwYWdlU2l6ZSAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3BhZ2VTaXplID0gcGFnZVNpemU7XG4gICAgICB9XG5cbiAgICAgIGlmIChwYWdlU2l6ZU9wdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9wYWdlU2l6ZU9wdGlvbnMgPSBwYWdlU2l6ZU9wdGlvbnM7XG4gICAgICB9XG5cbiAgICAgIGlmIChoaWRlUGFnZVNpemUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9oaWRlUGFnZVNpemUgPSBoaWRlUGFnZVNpemU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaG93Rmlyc3RMYXN0QnV0dG9ucyAhPSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Nob3dGaXJzdExhc3RCdXR0b25zID0gc2hvd0ZpcnN0TGFzdEJ1dHRvbnM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIHRoaXMuX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpO1xuICAgIHRoaXMuX21hcmtJbml0aWFsaXplZCgpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5faW50bENoYW5nZXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIC8qKiBBZHZhbmNlcyB0byB0aGUgbmV4dCBwYWdlIGlmIGl0IGV4aXN0cy4gKi9cbiAgbmV4dFBhZ2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc05leHRQYWdlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXggKyAxO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgYmFjayB0byB0aGUgcHJldmlvdXMgcGFnZSBpZiBpdCBleGlzdHMuICovXG4gIHByZXZpb3VzUGFnZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzUHJldmlvdXNQYWdlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXggLSAxO1xuICAgIHRoaXMuX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXgpO1xuICB9XG5cbiAgLyoqIE1vdmUgdG8gdGhlIGZpcnN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGZpcnN0UGFnZSgpOiB2b2lkIHtcbiAgICAvLyBoYXNQcmV2aW91c1BhZ2UgYmVpbmcgZmFsc2UgaW1wbGllcyBhdCB0aGUgc3RhcnRcbiAgICBpZiAoIXRoaXMuaGFzUHJldmlvdXNQYWdlKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwcmV2aW91c1BhZ2VJbmRleCA9IHRoaXMucGFnZUluZGV4O1xuICAgIHRoaXMucGFnZUluZGV4ID0gMDtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBNb3ZlIHRvIHRoZSBsYXN0IHBhZ2UgaWYgbm90IGFscmVhZHkgdGhlcmUuICovXG4gIGxhc3RQYWdlKCk6IHZvaWQge1xuICAgIC8vIGhhc05leHRQYWdlIGJlaW5nIGZhbHNlIGltcGxpZXMgYXQgdGhlIGVuZFxuICAgIGlmICghdGhpcy5oYXNOZXh0UGFnZSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcHJldmlvdXNQYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleDtcbiAgICB0aGlzLnBhZ2VJbmRleCA9IHRoaXMuZ2V0TnVtYmVyT2ZQYWdlcygpIC0gMTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgcHJldmlvdXMgcGFnZS4gKi9cbiAgaGFzUHJldmlvdXNQYWdlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnBhZ2VJbmRleCA+PSAxICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBXaGV0aGVyIHRoZXJlIGlzIGEgbmV4dCBwYWdlLiAqL1xuICBoYXNOZXh0UGFnZSgpOiBib29sZWFuIHtcbiAgICBjb25zdCBtYXhQYWdlSW5kZXggPSB0aGlzLmdldE51bWJlck9mUGFnZXMoKSAtIDE7XG4gICAgcmV0dXJuIHRoaXMucGFnZUluZGV4IDwgbWF4UGFnZUluZGV4ICYmIHRoaXMucGFnZVNpemUgIT0gMDtcbiAgfVxuXG4gIC8qKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBwYWdlcyAqL1xuICBnZXROdW1iZXJPZlBhZ2VzKCk6IG51bWJlciB7XG4gICAgaWYgKCF0aGlzLnBhZ2VTaXplKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5jZWlsKHRoaXMubGVuZ3RoIC8gdGhpcy5wYWdlU2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2hhbmdlcyB0aGUgcGFnZSBzaXplIHNvIHRoYXQgdGhlIGZpcnN0IGl0ZW0gZGlzcGxheWVkIG9uIHRoZSBwYWdlIHdpbGwgc3RpbGwgYmVcbiAgICogZGlzcGxheWVkIHVzaW5nIHRoZSBuZXcgcGFnZSBzaXplLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgaWYgdGhlIHBhZ2Ugc2l6ZSBpcyAxMCBhbmQgb24gdGhlIHNlY29uZCBwYWdlIChpdGVtcyBpbmRleGVkIDEwLTE5KSB0aGVuXG4gICAqIHN3aXRjaGluZyBzbyB0aGF0IHRoZSBwYWdlIHNpemUgaXMgNSB3aWxsIHNldCB0aGUgdGhpcmQgcGFnZSBhcyB0aGUgY3VycmVudCBwYWdlIHNvXG4gICAqIHRoYXQgdGhlIDEwdGggaXRlbSB3aWxsIHN0aWxsIGJlIGRpc3BsYXllZC5cbiAgICovXG4gIF9jaGFuZ2VQYWdlU2l6ZShwYWdlU2l6ZTogbnVtYmVyKSB7XG4gICAgLy8gQ3VycmVudCBwYWdlIG5lZWRzIHRvIGJlIHVwZGF0ZWQgdG8gcmVmbGVjdCB0aGUgbmV3IHBhZ2Ugc2l6ZS4gTmF2aWdhdGUgdG8gdGhlIHBhZ2VcbiAgICAvLyBjb250YWluaW5nIHRoZSBwcmV2aW91cyBwYWdlJ3MgZmlyc3QgaXRlbS5cbiAgICBjb25zdCBzdGFydEluZGV4ID0gdGhpcy5wYWdlSW5kZXggKiB0aGlzLnBhZ2VTaXplO1xuICAgIGNvbnN0IHByZXZpb3VzUGFnZUluZGV4ID0gdGhpcy5wYWdlSW5kZXg7XG5cbiAgICB0aGlzLnBhZ2VJbmRleCA9IE1hdGguZmxvb3Ioc3RhcnRJbmRleCAvIHBhZ2VTaXplKSB8fCAwO1xuICAgIHRoaXMucGFnZVNpemUgPSBwYWdlU2l6ZTtcbiAgICB0aGlzLl9lbWl0UGFnZUV2ZW50KHByZXZpb3VzUGFnZUluZGV4KTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgYnV0dG9ucyBmb3IgZ29pbmcgZm9yd2FyZHMgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZCB8fCAhdGhpcy5oYXNOZXh0UGFnZSgpO1xuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoZSBidXR0b25zIGZvciBnb2luZyBiYWNrd2FyZHMgc2hvdWxkIGJlIGRpc2FibGVkLiAqL1xuICBfcHJldmlvdXNCdXR0b25zRGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzYWJsZWQgfHwgIXRoaXMuaGFzUHJldmlvdXNQYWdlKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgbGlzdCBvZiBwYWdlIHNpemUgb3B0aW9ucyB0byBkaXNwbGF5IHRvIHRoZSB1c2VyLiBJbmNsdWRlcyBtYWtpbmcgc3VyZSB0aGF0XG4gICAqIHRoZSBwYWdlIHNpemUgaXMgYW4gb3B0aW9uIGFuZCB0aGF0IHRoZSBsaXN0IGlzIHNvcnRlZC5cbiAgICovXG4gIHByaXZhdGUgX3VwZGF0ZURpc3BsYXllZFBhZ2VTaXplT3B0aW9ucygpIHtcbiAgICBpZiAoIXRoaXMuX2luaXRpYWxpemVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSWYgbm8gcGFnZSBzaXplIGlzIHByb3ZpZGVkLCB1c2UgdGhlIGZpcnN0IHBhZ2Ugc2l6ZSBvcHRpb24gb3IgdGhlIGRlZmF1bHQgcGFnZSBzaXplLlxuICAgIGlmICghdGhpcy5wYWdlU2l6ZSkge1xuICAgICAgY29uc3QgcGFnZVNpemUgPVxuICAgICAgICB0aGlzLnBhZ2VTaXplT3B0aW9ucy5sZW5ndGggIT0gMCA/IHRoaXMucGFnZVNpemVPcHRpb25zWzBdIDogREVGQVVMVF9QQUdFX1NJWkU7XG4gICAgICB0aGlzLl9wYWdlU2l6ZSA9IHR5cGVvZiBwYWdlU2l6ZSA9PT0gJ251bWJlcicgPyBwYWdlU2l6ZSA6IHBhZ2VTaXplLnZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucyA9IHRoaXMucGFnZVNpemVPcHRpb25zLm1hcChwYWdlU2l6ZSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHBhZ2VTaXplID09PSAnbnVtYmVyJykge1xuICAgICAgICByZXR1cm4ge3ZhbHVlOiBwYWdlU2l6ZSwgbGFiZWw6IGAke3BhZ2VTaXplfWB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhZ2VTaXplO1xuICAgIH0pO1xuXG4gICAgaWYgKCF0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMuc29tZSh4ID0+IHgudmFsdWUgPT09IHRoaXMucGFnZVNpemUpKSB7XG4gICAgICB0aGlzLl9kaXNwbGF5ZWRQYWdlU2l6ZU9wdGlvbnMucHVzaCh7dmFsdWU6IHRoaXMucGFnZVNpemUsIGxhYmVsOiBgJHt0aGlzLnBhZ2VTaXplfWB9KTtcbiAgICB9XG5cbiAgICAvLyBTb3J0IHRoZSBudW1iZXJzIHVzaW5nIGEgbnVtYmVyLXNwZWNpZmljIHNvcnQgZnVuY3Rpb24uXG4gICAgdGhpcy5fZGlzcGxheWVkUGFnZVNpemVPcHRpb25zLnNvcnQoKGEsIGIpID0+IGEudmFsdWUgLSBiLnZhbHVlKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKiBFbWl0cyBhbiBldmVudCBub3RpZnlpbmcgdGhhdCBhIGNoYW5nZSBvZiB0aGUgcGFnaW5hdG9yJ3MgcHJvcGVydGllcyBoYXMgYmVlbiB0cmlnZ2VyZWQuICovXG4gIHByaXZhdGUgX2VtaXRQYWdlRXZlbnQocHJldmlvdXNQYWdlSW5kZXg6IG51bWJlcikge1xuICAgIHRoaXMucGFnZS5lbWl0KHtcbiAgICAgIHByZXZpb3VzUGFnZUluZGV4LFxuICAgICAgcGFnZUluZGV4OiB0aGlzLnBhZ2VJbmRleCxcbiAgICAgIHBhZ2VTaXplOiB0aGlzLnBhZ2VTaXplLFxuICAgICAgbGVuZ3RoOiB0aGlzLmxlbmd0aCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbXBvbmVudCB0byBwcm92aWRlIG5hdmlnYXRpb24gYmV0d2VlbiBwYWdlZCBpbmZvcm1hdGlvbi4gRGlzcGxheXMgdGhlIHNpemUgb2YgdGhlIGN1cnJlbnRcbiAqIHBhZ2UsIHVzZXItc2VsZWN0YWJsZSBvcHRpb25zIHRvIGNoYW5nZSB0aGF0IHNpemUsIHdoYXQgaXRlbXMgYXJlIGJlaW5nIHNob3duLCBhbmRcbiAqIG5hdmlnYXRpb25hbCBidXR0b24gdG8gZ28gdG8gdGhlIHByZXZpb3VzIG9yIG5leHQgcGFnZS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbWF0LXBhZ2luYXRvcicsXG4gIGV4cG9ydEFzOiAnbWF0UGFnaW5hdG9yJyxcbiAgdGVtcGxhdGVVcmw6ICdwYWdpbmF0b3IuaHRtbCcsXG4gIHN0eWxlVXJsczogWydwYWdpbmF0b3IuY3NzJ10sXG4gIGlucHV0czogWydkaXNhYmxlZCddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC1wYWdpbmF0b3InLFxuICAgICdyb2xlJzogJ2dyb3VwJyxcbiAgfSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG59KVxuZXhwb3J0IGNsYXNzIE1hdFBhZ2luYXRvciBleHRlbmRzIF9NYXRQYWdpbmF0b3JCYXNlPE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zPiB7XG4gIC8qKiBJZiBzZXQsIHN0eWxlcyB0aGUgXCJwYWdlIHNpemVcIiBmb3JtIGZpZWxkIHdpdGggdGhlIGRlc2lnbmF0ZWQgc3R5bGUuICovXG4gIF9mb3JtRmllbGRBcHBlYXJhbmNlPzogTWF0Rm9ybUZpZWxkQXBwZWFyYW5jZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBpbnRsOiBNYXRQYWdpbmF0b3JJbnRsLFxuICAgIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE1BVF9QQUdJTkFUT1JfREVGQVVMVF9PUFRJT05TKSBkZWZhdWx0cz86IE1hdFBhZ2luYXRvckRlZmF1bHRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcihpbnRsLCBjaGFuZ2VEZXRlY3RvclJlZiwgZGVmYXVsdHMpO1xuXG4gICAgaWYgKGRlZmF1bHRzICYmIGRlZmF1bHRzLmZvcm1GaWVsZEFwcGVhcmFuY2UgIT0gbnVsbCkge1xuICAgICAgdGhpcy5fZm9ybUZpZWxkQXBwZWFyYW5jZSA9IGRlZmF1bHRzLmZvcm1GaWVsZEFwcGVhcmFuY2U7XG4gICAgfVxuICB9XG59XG4iLCI8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1vdXRlci1jb250YWluZXJcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItY29udGFpbmVyXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcGFnZS1zaXplXCIgKm5nSWY9XCIhaGlkZVBhZ2VTaXplXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibWF0LXBhZ2luYXRvci1wYWdlLXNpemUtbGFiZWxcIj5cbiAgICAgICAge3tfaW50bC5pdGVtc1BlclBhZ2VMYWJlbH19XG4gICAgICA8L2Rpdj5cblxuICAgICAgPG1hdC1mb3JtLWZpZWxkXG4gICAgICAgICpuZ0lmPVwiX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5sZW5ndGggPiAxXCJcbiAgICAgICAgW2FwcGVhcmFuY2VdPVwiX2Zvcm1GaWVsZEFwcGVhcmFuY2UhXCJcbiAgICAgICAgW2NvbG9yXT1cImNvbG9yXCJcbiAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZS1zZWxlY3RcIj5cbiAgICAgICAgPG1hdC1zZWxlY3RcbiAgICAgICAgICBbdmFsdWVdPVwicGFnZVNpemVcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgW3BhbmVsQ2xhc3NdPVwic2VsZWN0Q29uZmlnLnBhbmVsQ2xhc3MgfHwgJydcIlxuICAgICAgICAgIFtkaXNhYmxlT3B0aW9uQ2VudGVyaW5nXT1cInNlbGVjdENvbmZpZy5kaXNhYmxlT3B0aW9uQ2VudGVyaW5nXCJcbiAgICAgICAgICBbYXJpYS1sYWJlbF09XCJfaW50bC5pdGVtc1BlclBhZ2VMYWJlbFwiXG4gICAgICAgICAgKHNlbGVjdGlvbkNoYW5nZSk9XCJfY2hhbmdlUGFnZVNpemUoJGV2ZW50LnZhbHVlKVwiPlxuICAgICAgICAgIDxtYXQtb3B0aW9uICpuZ0Zvcj1cImxldCBwYWdlU2l6ZU9wdGlvbiBvZiBfZGlzcGxheWVkUGFnZVNpemVPcHRpb25zXCIgW3ZhbHVlXT1cInBhZ2VTaXplT3B0aW9uLnZhbHVlXCI+XG4gICAgICAgICAgICB7e3BhZ2VTaXplT3B0aW9uLmxhYmVsfX1cbiAgICAgICAgICA8L21hdC1vcHRpb24+XG4gICAgICAgIDwvbWF0LXNlbGVjdD5cbiAgICAgIDwvbWF0LWZvcm0tZmllbGQ+XG5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLXBhZ2Utc2l6ZS12YWx1ZVwiXG4gICAgICAgICpuZ0lmPVwiX2Rpc3BsYXllZFBhZ2VTaXplT3B0aW9ucy5sZW5ndGggPD0gMVwiPnt7cGFnZVNpemV9fTwvZGl2PlxuICAgIDwvZGl2PlxuXG4gICAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcmFuZ2UtYWN0aW9uc1wiPlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItcmFuZ2UtbGFiZWxcIj5cbiAgICAgICAge3tfaW50bC5nZXRSYW5nZUxhYmVsKHBhZ2VJbmRleCwgcGFnZVNpemUsIGxlbmd0aCl9fVxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1maXJzdFwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJmaXJzdFBhZ2UoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX2ludGwuZmlyc3RQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCJfaW50bC5maXJzdFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwRGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcFBvc2l0aW9uXT1cIidhYm92ZSdcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICAqbmdJZj1cInNob3dGaXJzdExhc3RCdXR0b25zXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWljb25cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZm9jdXNhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTE4LjQxIDE2LjU5TDEzLjgyIDEybDQuNTktNC41OUwxNyA2bC02IDYgNiA2ek02IDZoMnYxMkg2elwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1wcmV2aW91c1wiXG4gICAgICAgICAgICAgIChjbGljayk9XCJwcmV2aW91c1BhZ2UoKVwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiX2ludGwucHJldmlvdXNQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCJfaW50bC5wcmV2aW91c1BhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwRGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcFBvc2l0aW9uXT1cIidhYm92ZSdcIlxuICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiX3ByZXZpb3VzQnV0dG9uc0Rpc2FibGVkKClcIj5cbiAgICAgICAgPHN2ZyBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItaWNvblwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmb2N1c2FibGU9XCJmYWxzZVwiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTUuNDEgNy40MUwxNCA2bC02IDYgNiA2IDEuNDEtMS40MUwxMC44MyAxMnpcIi8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIG1hdC1pY29uLWJ1dHRvbiB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLW5hdmlnYXRpb24tbmV4dFwiXG4gICAgICAgICAgICAgIChjbGljayk9XCJuZXh0UGFnZSgpXCJcbiAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJfaW50bC5uZXh0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBdPVwiX2ludGwubmV4dFBhZ2VMYWJlbFwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwRGlzYWJsZWRdPVwiX25leHRCdXR0b25zRGlzYWJsZWQoKVwiXG4gICAgICAgICAgICAgIFttYXRUb29sdGlwUG9zaXRpb25dPVwiJ2Fib3ZlJ1wiXG4gICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWljb25cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZm9jdXNhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTEwIDZMOC41OSA3LjQxIDEzLjE3IDEybC00LjU4IDQuNTlMMTAgMThsNi02elwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gbWF0LWljb24tYnV0dG9uIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICBjbGFzcz1cIm1hdC1wYWdpbmF0b3ItbmF2aWdhdGlvbi1sYXN0XCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cImxhc3RQYWdlKClcIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIl9pbnRsLmxhc3RQYWdlTGFiZWxcIlxuICAgICAgICAgICAgICBbbWF0VG9vbHRpcF09XCJfaW50bC5sYXN0UGFnZUxhYmVsXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBEaXNhYmxlZF09XCJfbmV4dEJ1dHRvbnNEaXNhYmxlZCgpXCJcbiAgICAgICAgICAgICAgW21hdFRvb2x0aXBQb3NpdGlvbl09XCInYWJvdmUnXCJcbiAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cIl9uZXh0QnV0dG9uc0Rpc2FibGVkKClcIlxuICAgICAgICAgICAgICAqbmdJZj1cInNob3dGaXJzdExhc3RCdXR0b25zXCI+XG4gICAgICAgIDxzdmcgY2xhc3M9XCJtYXQtcGFnaW5hdG9yLWljb25cIiB2aWV3Qm94PVwiMCAwIDI0IDI0XCIgZm9jdXNhYmxlPVwiZmFsc2VcIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTUuNTkgNy40MUwxMC4xOCAxMmwtNC41OSA0LjU5TDcgMThsNi02LTYtNnpNMTYgNmgydjEyaC0yelwiLz5cbiAgICAgICAgPC9zdmc+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==