import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CloudService } from 'src/app/services/cloud.service';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  user: any;
  playlist = [];

  menuItems = [
    {
      title: 'Home',
      icon: 'home-outline',
      link: ['home']
    },
    {
      title: 'Search',
      icon: 'search-outline',
      link: ['search']
    },
    {
      title: 'Library',
      icon: 'book-outline',
      link: ['library'],
      hidden: true
    },
    {
      title: 'Playlist',
      icon: 'headphones-outline',
      hidden: true,
      children: this.playlist,
    },
    {
      title: 'Upload music',
      icon: 'cloud-upload-outline',
      link: ['upload'],
      hidden: false
    }
  ];
  isCompact = true;
  constructor(private authService: AuthService, private cloud: CloudService,
              private sidebarService: NbSidebarService) {
    this.playlist.push({
      title: 'Liked Song',
      icon: 'heart-outline',
      link: ['library/liked-song']
    });
    this.authService.user$.subscribe(userData => {
      this.user = userData;
      this.cloud.getAllPlaylist(this.user).subscribe(data => {
        data.forEach(d => {
          this.playlist.push(d.payload.doc.data());
        });
      });
      if (this.user !== null) {
        this.menuItems.forEach(item => (item.hidden = false));
      } else {
        this.menuItems.forEach(item => {
          if (item.title === 'Home' || item.title === 'Search') {
            item.hidden = false;
          } else {
            item.hidden = false;
          }
        });
      }
    });
  }

  ngOnInit() {}

  change() {
    if (this.isCompact === false) {
      this.sidebarService.compact();
      this.isCompact = true;
    }

    if (this.isCompact === true) {
      this.sidebarService.collapse();
      this.isCompact = false;
    }
  }

}
