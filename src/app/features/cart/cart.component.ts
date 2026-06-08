import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { environment } from '../../../environments/environment';

declare const Razorpay: any;

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, ToastComponent],
  template: `
    <app-toast></app-toast>
    <div class="cart-page page-enter">
      <div class="container">
        <h1 class="page-title">Shopping Cart</h1>

        <div class="cart-layout" *ngIf="!loading">
          <!-- Empty -->
          <div class="empty-cart" *ngIf="items.length === 0">
            <div class="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Explore our courses and find something exciting to learn!</p>
            <a routerLink="/courses" class="btn btn-primary">Browse Courses</a>
          </div>

          <!-- Cart Items + Summary -->
          <ng-container *ngIf="items.length > 0">
            <div class="cart-items">
              <p class="item-count">{{ items.length }} course{{ items.length > 1 ? 's' : '' }} in cart</p>
              <div class="cart-item" *ngFor="let item of items">
                <div class="item-info">
                  <div class="item-thumb">
                    <span>📚</span>
                  </div>
                  <div class="item-details">
                    <p class="item-title">{{ item.title }}</p>
                    <p class="item-price">₹{{ item.price | number:'1.0-0' }}</p>
                  </div>
                </div>
                <button class="remove-btn" (click)="removeItem(item.courseId)" title="Remove">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <div class="cart-summary">
              <h2>Order Summary</h2>
              <div class="summary-row">
                <span>Subtotal ({{ items.length }} courses)</span>
                <span>₹{{ totalPrice | number:'1.0-0' }}</span>
              </div>
              <div class="summary-row discount">
                <span>Platform discount</span>
                <span>-₹0</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span class="total-amount">₹{{ totalPrice | number:'1.0-0' }}</span>
              </div>
              <button class="btn btn-primary" style="width:100%;margin-top:16px" (click)="checkout()" [disabled]="checkingOut">
                <span *ngIf="!checkingOut">🔒 Checkout</span>
                <span *ngIf="checkingOut">Processing...</span>
              </button>
              <a routerLink="/courses" class="btn btn-ghost" style="width:100%;margin-top:8px">Continue Shopping</a>
              <div class="secure-badge">
                <span>🔒</span> Secure payment via Razorpay
              </div>
            </div>
          </ng-container>
        </div>

        <div class="loading-overlay" *ngIf="loading">
          <div class="spinner"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { padding: 80px 0 40px; min-height: 100dvh; }
    .page-title { font-size: 2rem; margin-bottom: 32px; }
    .cart-layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; align-items: start; }
    .empty-cart { text-align: center; padding: 80px 0; }
    .empty-icon { font-size: 4rem; margin-bottom: 20px; }
    .empty-cart h2 { font-size: 1.5rem; margin-bottom: 10px; }
    .empty-cart p { color: var(--text-secondary); margin-bottom: 28px; }
    .item-count { color: var(--text-muted); font-size: 0.88rem; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
    .cart-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 0; border-bottom: 1px solid var(--border-color);
    }
    .item-info { display: flex; align-items: center; gap: 16px; flex: 1; }
    .item-thumb {
      width: 64px; height: 48px; border-radius: var(--radius-sm);
      background: var(--gradient-card); border: 1px solid var(--border-color);
      display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;
    }
    .item-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }
    .item-price { color: var(--brand-purple-light); font-weight: 700; font-size: 0.9rem; }
    .remove-btn {
      background: none; border: none; cursor: pointer; color: var(--text-muted);
      padding: 6px; border-radius: var(--radius-sm); transition: all var(--transition-fast);
    }
    .remove-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
    .cart-summary {
      background: var(--bg-card); border: 1px solid var(--border-color);
      border-radius: var(--radius-xl); padding: 28px; position: sticky; top: 80px;
    }
    .cart-summary h2 { font-size: 1.1rem; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color); }
    .summary-row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 12px; }
    .summary-row.discount { color: #22c55e; }
    .summary-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; padding-top: 16px; border-top: 1px solid var(--border-color); margin-top: 4px; }
    .total-amount { color: var(--brand-purple-light); }
    .secure-badge { text-align: center; margin-top: 16px; font-size: 0.78rem; color: var(--text-muted); }
    @media (max-width: 900px) { .cart-layout { grid-template-columns: 1fr; } }
  `]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  loading = true;
  checkingOut = false;

  constructor(private cartService: CartService, private toast: ToastService, private router: Router) {}

  get totalPrice(): number { return this.items.reduce((sum, i) => sum + i.price, 0); }

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({ next: items => { this.items = items; this.loading = false; }, error: () => this.loading = false });
    this.cartService.cartItems$.subscribe(items => this.items = items);
  }

  removeItem(courseId: number): void {
    this.cartService.removeFromCart(courseId).subscribe({
      next: () => this.toast.success('Removed from cart'),
      error: (e) => this.toast.error(e.error?.message || 'Error removing item')
    });
  }

  checkout(): void {
    this.checkingOut = true;
    this.cartService.checkout().subscribe({
      next: (res) => {
        const options = {
          key: 'rzp_test_SxuEUTVyT5XM30',
          amount: res.amount * 100,
          currency: res.currency,
          order_id: res.razorpayOrderId,
          name: 'UdemyClone',
          description: 'Course Purchase',
          theme: { color: '#a435f0' },
          handler: (response: any) => {
            this.cartService.verifyPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature).subscribe({
              next: () => { this.toast.success('Payment successful! 🎉'); this.router.navigate(['/checkout/success']); },
              error: () => { this.toast.error('Payment verification failed'); this.checkingOut = false; }
            });
          },
          modal: { ondismiss: () => { this.checkingOut = false; } }
        };
        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (e) => { this.toast.error(e.error?.message || 'Checkout failed'); this.checkingOut = false; }
    });
  }
}
