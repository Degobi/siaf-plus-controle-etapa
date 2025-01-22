import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from '../layout/service/app.layout.service';
import { FooterService } from '../layout/service/app.footer.service';
import { HomeService } from '../service/home.service';
import { Priority } from '../base/priority.enum';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public windowWidth: number;
  public windowHeight: number;
  
  selectedCardIndex: number | null = null;
  selectedButton: string | null = null;
  ordensServico: any[] = [];
  isLoading: boolean = false;
  hoveredCardIndex: number | null = null;

  constructor(public layoutService: LayoutService,
    private homeService: HomeService,
    private footerService: FooterService) {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
  }

  ngOnInit() {
    this.updateCardContainerHeight();
    this.loadMoreCards();

    this.footerService.selectedButton$.subscribe((button) => {
      this.selectedButton = button;
      console.log('Selected button:', button);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.windowWidth = event.target.innerWidth;
    this.windowHeight = event.target.innerHeight;
    this.updateCardContainerHeight();
  }

  updateCardContainerHeight(): void {
    if (this.windowWidth >= 769 && this.windowWidth <= 1024) {
      document.documentElement.style.setProperty('--cards-container-height', `calc(100vh - 17rem)`);
    } else if (this.windowWidth >= 481 && this.windowWidth <= 768) {
      document.documentElement.style.setProperty('--cards-container-height', `calc(100vh - 14rem)`);
    } else if (this.windowWidth <= 480) {
      document.documentElement.style.setProperty('--cards-container-height', `calc(100vh - 13rem)`);
    } else {
      document.documentElement.style.setProperty('--cards-container-height', `calc(100vh - 15rem)`);
    }
  }

  getRibbonColor(status: string): string {
    switch (status) {
      case 'new':
        return '#6360FF';
      case 'in-progress':
        return '#FFC960';
      case 'completed':
        return '#34C759';
      case 'pending':
        return '#FF5733';
      default:
        return '#6360FF';
    }
  }

  handleCardSelected(cardLabel: string | null): void {
    console.log('Filtro selecionado:', cardLabel);

  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
  
    const tolerance = 5;

    if (scrollTop + clientHeight >= scrollHeight - tolerance) {
      this.loadMoreCards();
    }
  }

  getPriorityLabel(priority: number): string {
    return Priority[priority];
  }

  loadMoreCards(): void {
    this.isLoading = true;
    this.homeService.getOrdens().subscribe({
      next: (newOrdens: any) => {
        this.ordensServico = [...this.ordensServico, ...newOrdens.items];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  selectCard(index: number): void {
    this.selectedCardIndex = index;
    let ordem =this.ordensServico[index];

    console.log("Ordem Selecionada:", ordem)
  }
}
