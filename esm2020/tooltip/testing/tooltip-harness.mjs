/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, HarnessPredicate, } from '@angular/cdk/testing';
export class _MatTooltipHarnessBase extends ComponentHarness {
    /** Shows the tooltip. */
    async show() {
        const host = await this.host();
        // We need to dispatch both `touchstart` and a hover event, because the tooltip binds
        // different events depending on the device. The `changedTouches` is there in case the
        // element has ripples.
        await host.dispatchEvent('touchstart', { changedTouches: [] });
        await host.hover();
        const panel = await this._optionalPanel();
        await panel?.dispatchEvent('animationend', { animationName: this._showAnimationName });
    }
    /** Hides the tooltip. */
    async hide() {
        const host = await this.host();
        // We need to dispatch both `touchstart` and a hover event, because
        // the tooltip binds different events depending on the device.
        await host.dispatchEvent('touchend');
        await host.mouseAway();
        const panel = await this._optionalPanel();
        await panel?.dispatchEvent('animationend', { animationName: this._hideAnimationName });
    }
    /** Gets whether the tooltip is open. */
    async isOpen() {
        const panel = await this._optionalPanel();
        return !!panel && !(await panel.hasClass(this._hiddenClass));
    }
    /** Gets a promise for the tooltip panel's text. */
    async getTooltipText() {
        const panel = await this._optionalPanel();
        return panel ? panel.text() : '';
    }
}
/** Harness for interacting with a standard mat-tooltip in tests. */
export class MatTooltipHarness extends _MatTooltipHarnessBase {
    constructor() {
        super(...arguments);
        this._optionalPanel = this.documentRootLocatorFactory().locatorForOptional('.mat-tooltip');
        this._hiddenClass = 'mat-tooltip-hide';
        this._showAnimationName = 'mat-tooltip-show';
        this._hideAnimationName = 'mat-tooltip-hide';
    }
    /**
     * Gets a `HarnessPredicate` that can be used to search
     * for a tooltip trigger with specific attributes.
     * @param options Options for narrowing the search.
     * @return a `HarnessPredicate` configured with the given options.
     */
    static with(options = {}) {
        return new HarnessPredicate(MatTooltipHarness, options);
    }
}
MatTooltipHarness.hostSelector = '.mat-tooltip-trigger';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC1oYXJuZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21hdGVyaWFsL3Rvb2x0aXAvdGVzdGluZy90b29sdGlwLWhhcm5lc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUVMLGdCQUFnQixFQUNoQixnQkFBZ0IsR0FFakIsTUFBTSxzQkFBc0IsQ0FBQztBQUc5QixNQUFNLE9BQWdCLHNCQUF1QixTQUFRLGdCQUFnQjtJQU1uRSx5QkFBeUI7SUFDekIsS0FBSyxDQUFDLElBQUk7UUFDUixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUUvQixxRkFBcUY7UUFDckYsc0ZBQXNGO1FBQ3RGLHVCQUF1QjtRQUN2QixNQUFNLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLEVBQUMsY0FBYyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDN0QsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUMsTUFBTSxLQUFLLEVBQUUsYUFBYSxDQUFDLGNBQWMsRUFBRSxFQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCx5QkFBeUI7SUFDekIsS0FBSyxDQUFDLElBQUk7UUFDUixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUUvQixtRUFBbUU7UUFDbkUsOERBQThEO1FBQzlELE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNyQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN2QixNQUFNLEtBQUssR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUMxQyxNQUFNLEtBQUssRUFBRSxhQUFhLENBQUMsY0FBYyxFQUFFLEVBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsRUFBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELHdDQUF3QztJQUN4QyxLQUFLLENBQUMsTUFBTTtRQUNWLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxtREFBbUQ7SUFDbkQsS0FBSyxDQUFDLGNBQWM7UUFDbEIsTUFBTSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDMUMsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQUVELG9FQUFvRTtBQUNwRSxNQUFNLE9BQU8saUJBQWtCLFNBQVEsc0JBQXNCO0lBQTdEOztRQUNZLG1CQUFjLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEYsaUJBQVksR0FBRyxrQkFBa0IsQ0FBQztRQUNsQyx1QkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztRQUN4Qyx1QkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztJQVlwRCxDQUFDO0lBVEM7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQWlDLEVBQUU7UUFDN0MsT0FBTyxJQUFJLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7O0FBVk0sOEJBQVksR0FBRyxzQkFBc0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBBc3luY0ZhY3RvcnlGbixcbiAgQ29tcG9uZW50SGFybmVzcyxcbiAgSGFybmVzc1ByZWRpY2F0ZSxcbiAgVGVzdEVsZW1lbnQsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7VG9vbHRpcEhhcm5lc3NGaWx0ZXJzfSBmcm9tICcuL3Rvb2x0aXAtaGFybmVzcy1maWx0ZXJzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIF9NYXRUb29sdGlwSGFybmVzc0Jhc2UgZXh0ZW5kcyBDb21wb25lbnRIYXJuZXNzIHtcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9vcHRpb25hbFBhbmVsOiBBc3luY0ZhY3RvcnlGbjxUZXN0RWxlbWVudCB8IG51bGw+O1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2hpZGRlbkNsYXNzOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBhYnN0cmFjdCBfc2hvd0FuaW1hdGlvbk5hbWU6IHN0cmluZztcbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9oaWRlQW5pbWF0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKiBTaG93cyB0aGUgdG9vbHRpcC4gKi9cbiAgYXN5bmMgc2hvdygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBob3N0ID0gYXdhaXQgdGhpcy5ob3N0KCk7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGRpc3BhdGNoIGJvdGggYHRvdWNoc3RhcnRgIGFuZCBhIGhvdmVyIGV2ZW50LCBiZWNhdXNlIHRoZSB0b29sdGlwIGJpbmRzXG4gICAgLy8gZGlmZmVyZW50IGV2ZW50cyBkZXBlbmRpbmcgb24gdGhlIGRldmljZS4gVGhlIGBjaGFuZ2VkVG91Y2hlc2AgaXMgdGhlcmUgaW4gY2FzZSB0aGVcbiAgICAvLyBlbGVtZW50IGhhcyByaXBwbGVzLlxuICAgIGF3YWl0IGhvc3QuZGlzcGF0Y2hFdmVudCgndG91Y2hzdGFydCcsIHtjaGFuZ2VkVG91Y2hlczogW119KTtcbiAgICBhd2FpdCBob3N0LmhvdmVyKCk7XG4gICAgY29uc3QgcGFuZWwgPSBhd2FpdCB0aGlzLl9vcHRpb25hbFBhbmVsKCk7XG4gICAgYXdhaXQgcGFuZWw/LmRpc3BhdGNoRXZlbnQoJ2FuaW1hdGlvbmVuZCcsIHthbmltYXRpb25OYW1lOiB0aGlzLl9zaG93QW5pbWF0aW9uTmFtZX0pO1xuICB9XG5cbiAgLyoqIEhpZGVzIHRoZSB0b29sdGlwLiAqL1xuICBhc3luYyBoaWRlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGhvc3QgPSBhd2FpdCB0aGlzLmhvc3QoKTtcblxuICAgIC8vIFdlIG5lZWQgdG8gZGlzcGF0Y2ggYm90aCBgdG91Y2hzdGFydGAgYW5kIGEgaG92ZXIgZXZlbnQsIGJlY2F1c2VcbiAgICAvLyB0aGUgdG9vbHRpcCBiaW5kcyBkaWZmZXJlbnQgZXZlbnRzIGRlcGVuZGluZyBvbiB0aGUgZGV2aWNlLlxuICAgIGF3YWl0IGhvc3QuZGlzcGF0Y2hFdmVudCgndG91Y2hlbmQnKTtcbiAgICBhd2FpdCBob3N0Lm1vdXNlQXdheSgpO1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpO1xuICAgIGF3YWl0IHBhbmVsPy5kaXNwYXRjaEV2ZW50KCdhbmltYXRpb25lbmQnLCB7YW5pbWF0aW9uTmFtZTogdGhpcy5faGlkZUFuaW1hdGlvbk5hbWV9KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHdoZXRoZXIgdGhlIHRvb2x0aXAgaXMgb3Blbi4gKi9cbiAgYXN5bmMgaXNPcGVuKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpO1xuICAgIHJldHVybiAhIXBhbmVsICYmICEoYXdhaXQgcGFuZWwuaGFzQ2xhc3ModGhpcy5faGlkZGVuQ2xhc3MpKTtcbiAgfVxuXG4gIC8qKiBHZXRzIGEgcHJvbWlzZSBmb3IgdGhlIHRvb2x0aXAgcGFuZWwncyB0ZXh0LiAqL1xuICBhc3luYyBnZXRUb29sdGlwVGV4dCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHBhbmVsID0gYXdhaXQgdGhpcy5fb3B0aW9uYWxQYW5lbCgpO1xuICAgIHJldHVybiBwYW5lbCA/IHBhbmVsLnRleHQoKSA6ICcnO1xuICB9XG59XG5cbi8qKiBIYXJuZXNzIGZvciBpbnRlcmFjdGluZyB3aXRoIGEgc3RhbmRhcmQgbWF0LXRvb2x0aXAgaW4gdGVzdHMuICovXG5leHBvcnQgY2xhc3MgTWF0VG9vbHRpcEhhcm5lc3MgZXh0ZW5kcyBfTWF0VG9vbHRpcEhhcm5lc3NCYXNlIHtcbiAgcHJvdGVjdGVkIF9vcHRpb25hbFBhbmVsID0gdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpLmxvY2F0b3JGb3JPcHRpb25hbCgnLm1hdC10b29sdGlwJyk7XG4gIHByb3RlY3RlZCBfaGlkZGVuQ2xhc3MgPSAnbWF0LXRvb2x0aXAtaGlkZSc7XG4gIHByb3RlY3RlZCBfc2hvd0FuaW1hdGlvbk5hbWUgPSAnbWF0LXRvb2x0aXAtc2hvdyc7XG4gIHByb3RlY3RlZCBfaGlkZUFuaW1hdGlvbk5hbWUgPSAnbWF0LXRvb2x0aXAtaGlkZSc7XG4gIHN0YXRpYyBob3N0U2VsZWN0b3IgPSAnLm1hdC10b29sdGlwLXRyaWdnZXInO1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgYEhhcm5lc3NQcmVkaWNhdGVgIHRoYXQgY2FuIGJlIHVzZWQgdG8gc2VhcmNoXG4gICAqIGZvciBhIHRvb2x0aXAgdHJpZ2dlciB3aXRoIHNwZWNpZmljIGF0dHJpYnV0ZXMuXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIG5hcnJvd2luZyB0aGUgc2VhcmNoLlxuICAgKiBAcmV0dXJuIGEgYEhhcm5lc3NQcmVkaWNhdGVgIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICovXG4gIHN0YXRpYyB3aXRoKG9wdGlvbnM6IFRvb2x0aXBIYXJuZXNzRmlsdGVycyA9IHt9KTogSGFybmVzc1ByZWRpY2F0ZTxNYXRUb29sdGlwSGFybmVzcz4ge1xuICAgIHJldHVybiBuZXcgSGFybmVzc1ByZWRpY2F0ZShNYXRUb29sdGlwSGFybmVzcywgb3B0aW9ucyk7XG4gIH1cbn1cbiJdfQ==